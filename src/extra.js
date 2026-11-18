import crypto from 'node:crypto';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { flushEmails } from './mailer.js';

let webpush = null;
try { webpush = (await import('web-push')).default; } catch { console.warn('web-push غير مثبّت: الإشعارات معطّلة'); }

export function mount(app, H) {
  const { pool, asUser, tx, wrap, bad, auth, admin, affiliate, authLimiter, str, int, oneOf,
    email_, password_, otpHash, token, SECRET, bcrypt, jwt, checkOtp } = H;
  const later = fn => fn().catch(e => console.error('extra:', e.message));

  /* ───── صور الهوية: جدول خاص لا يُعرض علناً، ولا يراه إلا المدير ───── */
  const ready2 = pool.query(`CREATE TABLE IF NOT EXISTS private_uploads (id uuid PRIMARY KEY, user_id bigint NOT NULL, mime text NOT NULL, data bytea NOT NULL, created_at timestamptz DEFAULT now())`)
    .then(() => pool.query(`CREATE TABLE IF NOT EXISTS id_documents (user_id bigint PRIMARY KEY, front_id uuid NOT NULL, back_id uuid NOT NULL, created_at timestamptz DEFAULT now())`))
    .then(() => pool.query('ALTER TABLE payout_requests ADD COLUMN IF NOT EXISTS admin_note text'))
    .then(() => pool.query('CREATE TABLE IF NOT EXISTS site_settings (key text PRIMARY KEY, value text NOT NULL, updated_at timestamptz DEFAULT now())'))
    .catch(e => console.error('id tables:', e.message));
  const IMG = { 'image/jpeg': 1, 'image/png': 1, 'image/webp': 1 };
  const idUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024, files: 2 },
    fileFilter: (_r, f, cb) => cb(IMG[f.mimetype] ? null : bad('صور JPG أو PNG أو WEBP فقط'), !!IMG[f.mimetype]) });
  app.post('/api/me/id-docs', ...affiliate, idUpload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]), wrap(async (req, res) => {
    await ready2;
    const f = req.files && req.files.front && req.files.front[0], b = req.files && req.files.back && req.files.back[0];
    if (!f || !b) throw bad('أرفق صورة وجه البطاقة وظهرها');
    const save = async file => { const id = crypto.randomUUID(); await pool.query('INSERT INTO private_uploads (id, user_id, mime, data) VALUES ($1, $2, $3, $4)', [id, req.user.id, file.mimetype, file.buffer]); return id; };
    const fi = await save(f), bi = await save(b);
    const { rows: [old] } = await pool.query('SELECT front_id, back_id FROM id_documents WHERE user_id = $1', [req.user.id]);
    await pool.query('INSERT INTO id_documents (user_id, front_id, back_id) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET front_id = $2, back_id = $3, created_at = now()', [req.user.id, fi, bi]);
    if (old) await pool.query('DELETE FROM private_uploads WHERE id = ANY($1::uuid[])', [[old.front_id, old.back_id]]);
    res.status(201).json({ ok: true });
  }));
  app.get('/api/admin/files/:id', ...admin, wrap(async (req, res) => {
    await ready2;
    if (!/^[0-9a-f-]{36}$/.test(req.params.id)) throw bad('غير موجود', 404);
    const { rows: [f] } = await pool.query('SELECT mime, data FROM private_uploads WHERE id = $1', [req.params.id]);
    if (!f) throw bad('غير موجود', 404);
    res.set({ 'Content-Type': f.mime, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' }).send(f.data);
  }));

  /* ───── الإشعارات: المفاتيح تُولَّد وتُحفظ في القاعدة تلقائياً ───── */
  let vapid = null;
  const ready = (async () => {
    if (!webpush) return;
    await pool.query('CREATE TABLE IF NOT EXISTS app_settings (key text PRIMARY KEY, value text NOT NULL)');
    await pool.query(`CREATE TABLE IF NOT EXISTS push_subscriptions (
      id serial PRIMARY KEY, user_id bigint NOT NULL, endpoint text UNIQUE NOT NULL,
      p256dh text NOT NULL, auth text NOT NULL, created_at timestamptz DEFAULT now())`);
    const { rows: [s] } = await pool.query("SELECT value FROM app_settings WHERE key = 'vapid'");
    let keys = s && JSON.parse(s.value);
    if (!keys) {
      keys = webpush.generateVAPIDKeys();
      await pool.query("INSERT INTO app_settings (key, value) VALUES ('vapid', $1) ON CONFLICT (key) DO NOTHING", [JSON.stringify(keys)]);
    }
    webpush.setVapidDetails('mailto:' + (process.env.MAIL_FROM_EMAIL || 'admin@eldoob.dz'), keys.publicKey, keys.privateKey);
    vapid = keys.publicKey;
  })().catch(e => console.error('push init:', e.message));

  async function push(userIds, title, body, url = '/') {
    await ready;
    if (!vapid || !userIds.length) return;
    const { rows } = await pool.query('SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ANY($1::bigint[])', [userIds]);
    await Promise.all(rows.map(async s => {
      try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify({ title, body, url })); }
      catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [s.id]); }
    }));
  }
  const admins = async () => (await pool.query("SELECT id FROM users WHERE role = 'admin' AND is_active")).rows.map(r => r.id);

  app.get('/api/push/key', auth, wrap(async (_req, res) => {
    await ready;
    if (!vapid) throw bad('الإشعارات غير مفعّلة على الخادم', 503);
    res.json({ key: vapid });
  }));
  app.post('/api/push/subscribe', auth, wrap(async (req, res) => {
    const s = req.body || {};
    const ep = str(s.endpoint, 'endpoint', 600), p = str(s.keys && s.keys.p256dh, 'p256dh', 200), a = str(s.keys && s.keys.auth, 'auth', 100);
    await pool.query('INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) VALUES ($1, $2, $3, $4) ON CONFLICT (endpoint) DO UPDATE SET user_id = $1, p256dh = $3, auth = $4', [req.user.id, ep, p, a]);
    res.json({ ok: true });
  }));
  app.post('/api/push/unsubscribe', auth, wrap(async (req, res) => {
    await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1 AND user_id = $2', [str(req.body && req.body.endpoint, 'endpoint', 600), req.user.id]);
    res.json({ ok: true });
  }));

  /* ───── استعادة كلمة السر على 3 مراحل + دخول بالرمز ───── */
  async function sendCode(email, why, isAdmin) {
    if (!isAdmin) { // حساب المدير بلا حد؛ بقية الحسابات: 3 رموز كل 24 ساعة (توفيراً لحصة Brevo المجانية)
      const { rows: [n] } = await pool.query("SELECT count(*)::int AS n FROM email_otps WHERE email = $1 AND purpose = 'reset' AND created_at > now() - interval '24 hours'", [email]);
      if (n.n >= 3) throw bad('وصلت للحد اليومي لرموز التحقق (3 رموز). حاول غداً', 429);
      const { rows: [last] } = await pool.query("SELECT created_at FROM email_otps WHERE email = $1 AND purpose = 'reset' ORDER BY id DESC LIMIT 1", [email]);
      if (last && Date.now() - new Date(last.created_at).getTime() < 60000) throw bad('انتظر دقيقة قبل طلب رمز جديد', 429);
    }
    const code = String(crypto.randomInt(100000, 1000000));
    await pool.query("INSERT INTO email_otps (purpose, email, code_hash, payload, expires_at) VALUES ('reset', $1, $2, NULL, now() + interval '10 minutes')", [email, otpHash(email, code)]);
    const how = why === 'login'
      ? 'أدخله في صفحة "دخول بالرمز" لتدخل إلى حسابك مباشرة.'
      : 'أدخله في صفحة التحقق، ثم اختر كلمة سر جديدة.\nأو استخدمه للدخول مباشرة من خيار "دخول بالرمز" دون كلمة سر.';
    const body = `رمز التحقق الخاص بك:\n\n${code}\n\nصالح لمدة 10 دقائق.\n\n${how}\n\nإن لم تطلب هذا الرمز فتجاهل الرسالة.`;
    await pool.query('INSERT INTO email_outbox (to_email, subject, body) VALUES ($1, $2, $3)', [email, 'رمز التحقق — ELDOOB.DZ', body]);
    flushEmails().catch(() => {});
  }
  const active = async email => (await pool.query('SELECT id, role, full_name FROM users WHERE email = $1 AND is_active', [email])).rows[0];
  const sess = u => ({ token: token(u.id), user: { id: u.id, role: u.role, full_name: u.full_name } });
  const GENERIC = { message: 'إن كان البريد مسجّلاً فقد أرسلنا إليه رمزاً. (الحد الأقصى 3 رموز في اليوم لكل حساب)' };
  const codeRoute = why => wrap(async (req, res) => {
    const email = email_(req.body.email);
    const au = await active(email);
    if (au) { try { await sendCode(email, why, au.role === 'admin'); } catch (e) { if (e.http !== 429) throw e; } }
    res.json(GENERIC);
  });
  app.post('/api/auth/forgot', authLimiter, codeRoute('reset'));
  app.post('/api/auth/login-code/start', authLimiter, codeRoute('login'));

  app.post('/api/auth/reset/verify', authLimiter, wrap(async (req, res) => {
    const email = email_(req.body.email);
    await checkOtp('reset', email, str(req.body.code, 'الرمز', 10));
    res.json({ reset_token: jwt.sign({ email, purpose: 'pwreset' }, SECRET, { expiresIn: '10m' }) });
  }));
  app.post('/api/auth/reset', authLimiter, wrap(async (req, res) => {
    let p;
    try { p = jwt.verify(String(req.body.reset_token || ''), SECRET); } catch { throw bad('انتهت المهلة. أعد طلب الرمز'); }
    if (p.purpose !== 'pwreset') throw bad('طلب غير صالح');
    const pass = password_(req.body.new_password);
    const { rows: [u] } = await pool.query("UPDATE users SET password_hash = $2, password_changed_at = now() - interval '3 seconds' WHERE email = $1 AND is_active RETURNING id, role, full_name", [p.email, await bcrypt.hash(pass, 12)]);
    if (!u) throw bad('الحساب غير موجود', 404);
    res.json(sess(u));
  }));
  app.post('/api/auth/login-code/verify', authLimiter, wrap(async (req, res) => {
    const email = email_(req.body.email);
    await checkOtp('reset', email, str(req.body.code, 'الرمز', 10));
    const u = await active(email);
    if (!u) throw bad('الحساب غير موجود', 404);
    res.json(sess(u));
  }));

  /* ───── فحص توفر اسم المستخدم أثناء التسجيل ───── */
  const unLimiter = rateLimit({ windowMs: 60000, limit: 40, standardHeaders: true, legacyHeaders: false });
  app.get('/api/auth/username-check', unLimiter, wrap(async (req, res) => {
    const u = String(req.query.u || '').trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(u)) return res.json({ available: false, valid: false, suggestions: [] });
    const taken = async list => new Set((await pool.query('SELECT lower(username) AS u FROM users WHERE lower(username) = ANY($1::text[])', [list])).rows.map(r => r.u));
    if (!(await taken([u])).has(u)) return res.json({ available: true, valid: true, suggestions: [] });
    const base = u.slice(0, 15).replace(/_+$/, '');
    const cands = [`${base}_dz`, `${base}${new Date().getFullYear()}`];
    while (cands.length < 14) cands.push(Math.random() < 0.5 ? `${base}${crypto.randomInt(10, 999)}` : `${base}_${crypto.randomInt(10, 999)}`);
    const list = [...new Set(cands)].filter(c => /^[a-z0-9_]{3,20}$/.test(c));
    const used = await taken(list);
    res.json({ available: false, valid: true, suggestions: list.filter(c => !used.has(c)).slice(0, 3) });
  }));

  /* ───── الولايات والبلديات في طلب واحد ───── */
  app.get('/api/geo', auth, wrap(async (_req, res) => {
    const wilayas = (await pool.query('SELECT code, name_ar, home_fee, desk_fee, available FROM wilayas ORDER BY code')).rows;
    const communes = {};
    for (const r of (await pool.query('SELECT wilaya_code, name FROM communes ORDER BY wilaya_code, id')).rows) (communes[r.wilaya_code] ||= []).push(r.name);
    res.set('Cache-Control', 'private, max-age=3600').json({ wilayas, communes });
  }));

  /* ───── الطلبات: تحقق من الولاية والبلدية + إشعار المدير ───── */
  app.post('/api/orders', ...affiliate, wrap(async (req, res, next) => {
    const code = int(req.body.wilaya_code, 'الولاية', 1);
    const { rows: [w] } = await pool.query('SELECT available FROM wilayas WHERE code = $1', [code]);
    if (!w) throw bad('الولاية غير موجودة');
    if (!w.available) throw bad('التوصيل غير متوفر حالياً في هذه الولاية');
    const { rows: [pr] } = await pool.query('SELECT base_price FROM products WHERE id = $1', [int(req.body.product_id, 'المنتج', 1)]);
    if (!pr) throw bad('المنتج غير موجود');
    if (!(Number(req.body.resale_price) >= Number(pr.base_price))) throw bad('السعر أقل من سعر المنتج');
    const { rows: list } = await pool.query('SELECT name FROM communes WHERE wilaya_code = $1', [code]);
    if (list.length && !list.some(r => r.name === String(req.body.commune || '').trim())) throw bad('اختر البلدية من القائمة');
    res.on('finish', () => { if (res.statusCode === 201) later(async () => push(await admins(), 'طلب جديد 📦', 'وصل طلب جديد بانتظار المراجعة', '/')); });
    next();
  }));
  app.patch('/api/orders/:id/note', ...admin, wrap(async (req, res) => {
    const note = String((req.body && req.body.admin_note) || '').trim().slice(0, 500);
    const row = await asUser(req.user, async c => (await c.query('UPDATE orders SET admin_note = $2 WHERE id = $1 RETURNING affiliate_id', [int(req.params.id, 'المعرّف', 1), note || null])).rows[0]);
    if (!row) throw bad('الطلب غير موجود', 404);
    if (note) later(() => push([row.affiliate_id], 'ELDOOB.DZ', `ملاحظة من الإدارة على طلبك: ${note}`.slice(0, 160), '/'));
    res.json({ ok: true });
  }));
  /* ───── إعلان المدير لكل المسوّقين ───── */
  app.get('/api/announcement', auth, wrap(async (_req, res) => {
    await ready2;
    const { rows: [r] } = await pool.query("SELECT value, updated_at FROM site_settings WHERE key = 'announcement'");
    res.json({ text: r ? r.value : '', at: r ? r.updated_at : null });
  }));
  app.put('/api/admin/announcement', ...admin, wrap(async (req, res) => {
    await ready2;
    const text = String((req.body && req.body.text) || '').trim().slice(0, 400);
    if (!text) await pool.query("DELETE FROM site_settings WHERE key = 'announcement'");
    else await pool.query("INSERT INTO site_settings (key, value) VALUES ('announcement', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()", [text]);
    if (text && req.body.notify === true) later(async () => {
      const { rows } = await pool.query("SELECT id FROM users WHERE role = 'affiliate' AND is_active");
      await push(rows.map(r => r.id), 'ELDOOB.DZ', text.slice(0, 140), '/');
    });
    res.json({ ok: true });
  }));

  /* ───── فحص سمعة رقم الزبون (أعداد فقط) ───── */
  app.get('/api/phone-check', auth, wrap(async (req, res) => {
    const ph = String(req.query.phone || '').replace(/\s/g, '');
    if (!/^0[567]\d{8}$/.test(ph)) throw bad('رقم غير صالح');
    const { rows: [r] } = await pool.query("SELECT count(*) FILTER (WHERE status::text = 'delivered') AS delivered, count(*) FILTER (WHERE status::text IN ('retour', 'cancelled')) AS bad FROM orders WHERE customer_phone = $1", [ph]);
    res.json({ delivered: Number(r.delivered), bad: Number(r.bad) });
  }));

  /* ───── إحصائيات المدير + نسخة احتياطية ───── */
  app.get('/api/admin/stats', ...admin, wrap(async (_req, res) => {
    const q = sql => pool.query(sql);
    const [o, pay, bal, top, aff] = await Promise.all([
      q(`SELECT count(*) FILTER (WHERE created_at >= date_trunc('day', now())) AS today,
                count(*) FILTER (WHERE status::text = 'pending') AS pending,
                count(*) FILTER (WHERE status::text = 'shipped') AS shipped,
                count(*) FILTER (WHERE status::text = 'delivered') AS delivered,
                count(*) FILTER (WHERE status::text IN ('cancelled', 'retour')) AS failed,
                COALESCE(sum(total_to_collect) FILTER (WHERE status::text = 'delivered' AND created_at >= now() - interval '30 days'), 0) AS sales30
         FROM orders`),
      q(`SELECT count(*) AS n, COALESCE(sum(amount), 0) AS total FROM payout_requests WHERE status::text = 'pending'`),
      q(`SELECT COALESCE(sum(balance), 0) AS owed FROM affiliate_balances`),
      q(`SELECT u.full_name AS name, count(*) AS orders, count(*) FILTER (WHERE o.status::text = 'delivered') AS delivered,
                COALESCE(sum(o.profit_amount) FILTER (WHERE o.status::text = 'delivered'), 0) AS earned
         FROM orders o JOIN users u ON u.id = o.affiliate_id GROUP BY u.id, u.full_name ORDER BY earned DESC, orders DESC LIMIT 5`),
      q(`SELECT count(*) FILTER (WHERE is_active) AS active, count(*) FILTER (WHERE NOT is_active AND rejected_at IS NULL) AS waiting FROM users WHERE role = 'affiliate'`),
    ]);
    res.json({ orders: o.rows[0], payouts: pay.rows[0], owed: bal.rows[0].owed, top: top.rows, aff: aff.rows[0] });
  }));
  app.get('/api/admin/export', ...admin, wrap(async (_req, res) => {
    const t = async sql => (await pool.query(sql)).rows;
    res.json({
      exported_at: new Date().toISOString(),
      users: (await t('SELECT * FROM users ORDER BY id')).map(({ password_hash, ...u }) => u),
      orders: await t('SELECT * FROM orders ORDER BY id'),
      payout_requests: await t('SELECT * FROM payout_requests ORDER BY id'),
      affiliate_balances: await t('SELECT * FROM affiliate_balances'),
      products: await t('SELECT * FROM products ORDER BY id'),
      wilayas: await t('SELECT * FROM wilayas ORDER BY code'),
    });
  }));

  app.patch('/api/orders/:id/status', ...admin, (req, res, next) => {
    res.on('finish', () => { if (res.statusCode === 200) later(async () => {
      const { rows: [o] } = await pool.query('SELECT affiliate_id FROM orders WHERE id = $1', [req.params.id]);
      const m = { shipped: 'تم شحن طلبك 🚚', delivered: 'تم تسليم الطلب وأُضيفت عمولتك ✅', cancelled: 'تم إلغاء الطلب', retour: 'تم إرجاع الطلب' }[req.body.status];
      const nt = String((req.body && req.body.admin_note) || '').trim();
      if (o && m) await push([o.affiliate_id], 'ELDOOB.DZ', nt ? `${m}\nملاحظة: ${nt}`.slice(0, 160) : m, '/');
    }); });
    next();
  });

  /* ───── السحب: جاري المعالجة / تم السحب / مرفوض ───── */
  app.post('/api/payouts', affiliate, wrap(async (req, res, next) => {
    await ready2;
    res.on('finish', () => { if (res.statusCode === 201) later(async () => push(await admins(), 'طلب سحب جديد 💸', 'وصل طلب سحب بانتظار المعالجة', '/')); });
    next();
  }));
  app.get('/api/wallet', auth, wrap(async (req, res) => {
    await ready2;
    const { rows: [w] } = await pool.query('SELECT balance, total_earned, pending_balance FROM affiliate_balances WHERE affiliate_id = $1', [req.user.id]);
    const { rows: payouts } = await pool.query(`SELECT id, amount, CASE WHEN is_processing AND status::text = 'pending' THEN 'processing' ELSE status::text END AS status, method, account, created_at, paid_at, admin_note
      FROM payout_requests WHERE affiliate_id = $1 ORDER BY id DESC LIMIT 20`, [req.user.id]);
    await ready2;
    const id_ok = (await pool.query('SELECT 1 FROM id_documents WHERE user_id = $1', [req.user.id])).rowCount > 0;
    res.json({ balance: w?.balance || 0, total_earned: w?.total_earned || 0, pending_balance: w?.pending_balance || 0, payouts, id_ok });
  }));
  app.get('/api/admin/payouts', ...admin, wrap(async (_req, res) => {
    await ready2;
    res.json((await pool.query(`SELECT p.id, p.amount, CASE WHEN p.is_processing THEN 'processing' ELSE p.status::text END AS status, p.method, p.account, p.created_at, p.admin_note, u.full_name AS affiliate, u.phone, d.front_id, d.back_id
      FROM payout_requests p JOIN users u ON u.id = p.affiliate_id LEFT JOIN id_documents d ON d.user_id = p.affiliate_id WHERE p.status::text = 'pending' ORDER BY p.id`)).rows);
  }));
  app.patch('/api/admin/payouts/:id', ...admin, wrap(async (req, res) => {
    await ready2;
    const status = oneOf(req.body.status, ['processing', 'paid', 'rejected'], 'الحالة'), id = int(req.params.id, 'المعرّف', 1);
    const note = req.body.admin_note === undefined ? null : String(req.body.admin_note).trim().slice(0, 300);
    const p = await tx(async c => {
      const { rows: [r] } = await c.query('SELECT affiliate_id, amount, status::text AS status FROM payout_requests WHERE id = $1 FOR UPDATE', [id]);
      if (!r || r.status !== 'pending') throw bad('طلب السحب غير موجود أو معالج مسبقاً');
      if (status === 'processing') {
        await c.query('UPDATE payout_requests SET is_processing = true, admin_note = COALESCE($2, admin_note) WHERE id = $1', [id, note]);
      } else {
        if (status === 'rejected') { const u = await c.query('UPDATE affiliate_balances SET balance = balance + $2 WHERE affiliate_id = $1', [r.affiliate_id, r.amount]); if (u.rowCount !== 1) throw bad('تعذّرت إعادة المبلغ إلى المحفظة', 500); }
        await c.query('UPDATE payout_requests SET status = $2, is_processing = false, paid_at = CASE WHEN $3 THEN now() END, admin_note = COALESCE($4, admin_note) WHERE id = $1', [id, status, status === 'paid', note]);
      }
      return r;
    });
    const m = { processing: 'طلب السحب قيد المعالجة ⏳', paid: 'تم تحويل أرباحك بنجاح ✅', rejected: 'تم رفض طلب السحب وأُعيد المبلغ لمحفظتك' }[status];
    later(() => push([p.affiliate_id], 'ELDOOB.DZ', note ? `${m}\nملاحظة: ${note}`.slice(0, 160) : m, '/'));
    res.json({ ok: true });
  }));
}
