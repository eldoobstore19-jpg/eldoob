import crypto from 'node:crypto';
import { flushEmails } from './mailer.js';

let webpush = null;
try { webpush = (await import('web-push')).default; } catch { console.warn('web-push غير مثبّت: الإشعارات معطّلة'); }

export function mount(app, H) {
  const { pool, asUser, wrap, bad, auth, admin, affiliate, authLimiter, str, int, oneOf,
    email_, password_, otpHash, token, SECRET, bcrypt, jwt, checkOtp } = H;
  const later = fn => fn().catch(e => console.error('extra:', e.message));

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
  async function sendCode(email, why) {
    const { rows: [last] } = await pool.query("SELECT created_at FROM email_otps WHERE email = $1 AND purpose = 'reset' ORDER BY id DESC LIMIT 1", [email]);
    if (last && Date.now() - new Date(last.created_at).getTime() < 60000) throw bad('انتظر دقيقة قبل طلب رمز جديد', 429);
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
  const GENERIC = { message: 'إن كان البريد مسجّلاً فقد أرسلنا إليه رمزاً.' };
  const codeRoute = why => wrap(async (req, res) => {
    const email = email_(req.body.email);
    if (await active(email)) { try { await sendCode(email, why); } catch (e) { if (e.http !== 429) throw e; } }
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
    const { rows: list } = await pool.query('SELECT name FROM communes WHERE wilaya_code = $1', [code]);
    if (list.length && !list.some(r => r.name === String(req.body.commune || '').trim())) throw bad('اختر البلدية من القائمة');
    res.on('finish', () => { if (res.statusCode === 201) later(async () => push(await admins(), 'طلب جديد 📦', 'وصل طلب جديد بانتظار المراجعة', '/')); });
    next();
  }));
  app.patch('/api/orders/:id/status', ...admin, (req, res, next) => {
    res.on('finish', () => { if (res.statusCode === 200) later(async () => {
      const { rows: [o] } = await pool.query('SELECT affiliate_id FROM orders WHERE id = $1', [req.params.id]);
      const m = { shipped: 'تم شحن طلبك 🚚', delivered: 'تم تسليم الطلب وأُضيفت عمولتك ✅', cancelled: 'تم إلغاء الطلب', retour: 'تم إرجاع الطلب' }[req.body.status];
      if (o && m) await push([o.affiliate_id], 'ELDOOB.DZ', m, '/');
    }); });
    next();
  });

  /* ───── السحب: جاري المعالجة / تم السحب / مرفوض ───── */
  app.post('/api/payouts', affiliate, (_req, res, next) => {
    res.on('finish', () => { if (res.statusCode === 201) later(async () => push(await admins(), 'طلب سحب جديد 💸', 'وصل طلب سحب بانتظار المعالجة', '/')); });
    next();
  });
  app.get('/api/admin/payouts', ...admin, wrap(async (_req, res) => {
    res.json((await pool.query(`SELECT p.id, p.amount, p.status, p.method, p.account, p.created_at, u.full_name AS affiliate, u.phone
      FROM payout_requests p JOIN users u ON u.id = p.affiliate_id WHERE p.status IN ('pending', 'processing') ORDER BY p.id`)).rows);
  }));
  app.patch('/api/admin/payouts/:id', ...admin, wrap(async (req, res) => {
    const status = oneOf(req.body.status, ['processing', 'paid', 'rejected'], 'الحالة'), id = int(req.params.id, 'المعرّف', 1);
    const p = await asUser(req.user, async c => {
      const { rows: [r] } = await c.query('SELECT affiliate_id, amount, status FROM payout_requests WHERE id = $1 FOR UPDATE', [id]);
      if (!r || !['pending', 'processing'].includes(r.status)) throw bad('طلب السحب غير موجود أو معالج مسبقاً');
      if (status === 'rejected') await c.query('UPDATE affiliate_balances SET balance = balance + $2 WHERE affiliate_id = $1', [r.affiliate_id, r.amount]);
      await c.query('UPDATE payout_requests SET status = $2, paid_at = CASE WHEN $3 THEN now() END WHERE id = $1', [id, status, status === 'paid']);
      return r;
    });
    const m = { processing: 'طلب السحب قيد المعالجة ⏳', paid: 'تم تحويل أرباحك بنجاح ✅', rejected: 'تم رفض طلب السحب وأُعيد المبلغ لمحفظتك' }[status];
    later(() => push([p.affiliate_id], 'ELDOOB.DZ', m, '/'));
    res.json({ ok: true });
  }));
}
