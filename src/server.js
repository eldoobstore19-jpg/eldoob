import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import crypto from 'node:crypto';
import { pool, asUser } from './db.js';
import { flushEmails, startMailer } from './mailer.js';
import { mount } from './extra.js';

const SECRET = process.env.JWT_SECRET;
if (!SECRET || SECRET.length < 32) throw new Error('JWT_SECRET يجب ألا يقل عن 32 حرفاً');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));
app.use(express.json({ limit: '100kb' }));
app.get('/healthz', (_req, res) => res.send('ok'));
app.use('/api', (req, res, next) => { if (req.method !== 'GET') res.on('finish', () => flushEmails().catch(() => {})); next(); });
app.use(express.static('public', { maxAge: '1h' }));

app.get('/uploads/:name', async (req, res, next) => {
  try {
    const m = /^([0-9a-f-]{36})\.(jpg|png|webp)$/.exec(req.params.name);
    const f = m && (await pool.query('SELECT mime, data FROM uploads WHERE id = $1', [m[1]])).rows[0];
    if (!f) return res.status(404).end();
    res.set({ 'Content-Type': f.mime, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' }).send(f.data);
  } catch (e) { next(e); }
});

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const bad = (msg, http = 400) => Object.assign(new Error(msg), { http });
const int = (v, name, min = 0) => { const n = Number(v); if (!Number.isInteger(n) || n < min) throw bad(`${name} غير صالح`); return n; };
const str = (v, name, max = 200) => { if (typeof v !== 'string' || !v.trim() || v.length > max) throw bad(`${name} مطلوب`); return v.trim(); };
const oneOf = (v, list, name) => { if (!list.includes(v)) throw bad(`${name} غير صالح`); return v; };
const opt = (v, f) => (v === undefined ? null : f(v));

const auth = wrap(async (req, _res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  let p;
  try { p = jwt.verify(token, SECRET); } catch { throw bad('سجّل الدخول من جديد', 401); }
  const { rows: [u] } = await pool.query('SELECT id, role, is_active, password_changed_at FROM users WHERE id = $1', [p.id]);
  if (!u || !u.is_active) throw bad('الحساب غير مفعّل', 401);
  if (p.iat < Math.floor(new Date(u.password_changed_at).getTime() / 1000)) throw bad('تغيّرت كلمة السر. سجّل الدخول من جديد', 401);
  req.user = { id: u.id, role: u.role };
  next();
});
const only = role => (req, _res, next) => (req.user.role === role ? next() : next(bad('غير مسموح', 403)));
const admin = [auth, only('admin')], affiliate = [auth, only('affiliate')];

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const DUMMY = bcrypt.hashSync('dummy-password', 12);

const USERNAME = /^[a-z0-9_]{3,20}$/, PHONE = /^0[567]\d{8}$/, EMAIL = /^\S+@\S+\.\S+$/;
const otpHash = (email, code) => crypto.createHmac('sha256', SECRET).update(`${email}:${code}`).digest('hex');
const mail = (to, subject, body) => pool.query('INSERT INTO email_outbox (to_email, subject, body) VALUES ($1, $2, $3)', [to, subject, body]);
const token = id => jwt.sign({ id }, SECRET, { expiresIn: '12h' });
const email_ = v => { const e = str(v, 'البريد الإلكتروني', 120).toLowerCase(); if (!EMAIL.test(e)) throw bad('بريد إلكتروني غير صالح'); return e; };
const password_ = v => { const s = str(v, 'كلمة المرور', 72); if (s.length < 8) throw bad('كلمة المرور 8 أحرف على الأقل'); return s; };
const username_ = v => { const s = str(v, 'اسم المستخدم', 20).toLowerCase(); if (!USERNAME.test(s)) throw bad('اسم المستخدم: 3 إلى 20 حرفاً'); return s; };
const phone_ = v => { const s = str(v, 'الهاتف', 10); if (!PHONE.test(s)) throw bad('رقم هاتف جزائري غير صالح'); return s; };

async function issueOtp(purpose, email, payload) {
  const { rows: [last] } = await pool.query('SELECT created_at FROM email_otps WHERE email = $1 AND purpose = $2 ORDER BY id DESC LIMIT 1', [email, purpose]);
  if (last && Date.now() - new Date(last.created_at).getTime() < 60000) throw bad('انتظر دقيقة قبل طلب رمز جديد', 429);
  const code = String(crypto.randomInt(100000, 1000000));
  await pool.query(`INSERT INTO email_otps (purpose, email, code_hash, payload, expires_at) VALUES ($1, $2, $3, $4, now() + interval '10 minutes')`,
    [purpose, email, otpHash(email, code), payload ? JSON.stringify(payload) : null]);
  await mail(email, purpose === 'register' ? 'رمز تأكيد بريدك في ELDOOB.DZ' : 'رمز إعادة تعيين كلمة السر', `رمزك: ${code}\nصالح لمدة 10 دقائق.`);
  await flushEmails().catch(() => {});
}
async function checkOtp(purpose, email, code) {
  const { rows: [o] } = await pool.query('SELECT * FROM email_otps WHERE email = $1 AND purpose = $2 AND used_at IS NULL ORDER BY id DESC LIMIT 1', [email, purpose]);
  if (!o || new Date(o.expires_at) < new Date()) throw bad('الرمز منتهي. اطلب رمزاً جديداً');
  if (o.attempts >= 5) throw bad('محاولات كثيرة. اطلب رمزاً جديداً', 429);
  await pool.query('UPDATE email_otps SET attempts = attempts + 1 WHERE id = $1', [o.id]);
  const a = Buffer.from(o.code_hash), b = Buffer.from(otpHash(email, String(code)));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw bad('الرمز غير صحيح');
  await pool.query('UPDATE email_otps SET used_at = now() WHERE id = $1', [o.id]);
  return o;
}

// مسارات إضافية: استعادة كلمة السر، الدخول بالرمز، الإشعارات، الولايات والبلديات، السحب
mount(app, { pool, asUser, wrap, bad, auth, admin, affiliate, authLimiter, str, int, oneOf, email_, password_, otpHash, token, SECRET, bcrypt, jwt, checkOtp });

app.post('/api/auth/register/start', authLimiter, wrap(async (req, res) => {
  const b = req.body, name = str(b.full_name, 'الاسم', 100), username = username_(b.username), phone = phone_(b.phone), email = email_(b.email), pass = password_(b.password);
  const { rows: [d] } = await pool.query('SELECT lower(username) = $1 AS u, phone = $2 AS p FROM users WHERE lower(username) = $1 OR phone = $2 OR email = $3 LIMIT 1', [username, phone, email]);
  if (d) throw bad(d.u ? 'اسم المستخدم محجوز' : d.p ? 'رقم الهاتف مسجّل مسبقاً' : 'البريد مسجّل مسبقاً', 409);
  await issueOtp('register', email, { full_name: name, username, phone, password_hash: await bcrypt.hash(pass, 12) });
  res.json({ message: 'أرسلنا رمز التأكيد إلى بريدك' });
}));

app.post('/api/auth/register/verify', authLimiter, wrap(async (req, res) => {
  const email = email_(req.body.email), o = await checkOtp('register', email, str(req.body.code, 'الرمز', 10)), d = o.payload;
  const { rows: [u] } = await pool.query(
    `INSERT INTO users (full_name, username, phone, email, password_hash, email_verified_at) VALUES ($1, $2, $3, $4, $5, now()) RETURNING id, role, full_name`,
    [d.full_name, d.username, d.phone, email, d.password_hash]);
  res.status(201).json({ token: token(u.id), user: { id: u.id, role: u.role, full_name: u.full_name } });
}));

app.post('/api/auth/login', authLimiter, wrap(async (req, res) => {
  const ident = String(req.body.identifier ?? req.body.phone ?? '').trim().toLowerCase();
  const { rows: [u] } = await pool.query('SELECT id, role, full_name, password_hash, is_active, rejected_at FROM users WHERE email = $1 OR lower(username) = $1', [ident]);
  const ok = await bcrypt.compare(String(req.body.password || ''), u ? u.password_hash : DUMMY);
  if (!u || !ok) throw bad('بيانات الدخول غير صحيحة', 401);
  if (!u.is_active) throw bad('هذا الحساب معطّل', 403);
  res.json({ token: token(u.id), user: { id: u.id, role: u.role, full_name: u.full_name } });
}));

app.get('/api/me', auth, wrap(async (req, res) => {
  const { rows: [u] } = await pool.query('SELECT id, role, full_name, username, phone, email, email_verified_at IS NOT NULL AS email_verified, avatar_url, payout_method, payout_account FROM users WHERE id = $1', [req.user.id]);
  res.json(u);
}));

app.patch('/api/me', auth, wrap(async (req, res) => {
  const b = req.body;
  await pool.query(
    `UPDATE users SET full_name = COALESCE($2, full_name), username = COALESCE($3, username), phone = COALESCE($4, phone),
       payout_method = COALESCE($5, payout_method), payout_account = COALESCE($6, payout_account) WHERE id = $1`,
    [req.user.id, opt(b.full_name, v => str(v, 'الاسم', 100)), opt(b.username, username_), opt(b.phone, phone_),
     opt(b.payout_method, v => oneOf(v, ['flexy', 'baridimob', 'direct'], 'طريقة الدفع')), opt(b.payout_account, v => str(v, 'حساب الدفع', 40))]);
  res.json({ ok: true });
}));

app.post('/api/me/password', auth, wrap(async (req, res) => {
  const { rows: [u] } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  if (!(await bcrypt.compare(String(req.body.current_password || ''), u.password_hash))) throw bad('كلمة السر الحالية غير صحيحة', 400);
  await pool.query("UPDATE users SET password_hash = $2, password_changed_at = now() - interval '3 seconds' WHERE id = $1", [req.user.id, await bcrypt.hash(password_(req.body.new_password), 12)]);
  res.json({ token: token(req.user.id) });
}));

app.get('/api/admin/users', ...admin, wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, full_name, phone, email, is_active, rejected_at, created_at FROM users
     WHERE role = 'affiliate' AND ($1::boolean IS NOT TRUE OR (NOT is_active AND rejected_at IS NULL)) ORDER BY id DESC`, [req.query.pending === '1']);
  res.json(rows);
}));

app.patch('/api/admin/users/:id', ...admin, wrap(async (req, res) => {
  const approve = oneOf(req.body.action, ['approve', 'reject'], 'الإجراء') === 'approve';
  await pool.query(`UPDATE users SET is_active = $2, rejected_at = CASE WHEN $2 THEN NULL ELSE now() END WHERE id = $1 AND role = 'affiliate'`,
    [int(req.params.id, 'المعرّف', 1), approve]);
  res.json({ ok: true });
}));

app.get('/api/wilayas', auth, wrap(async (_req, res) => {
  res.json((await pool.query('SELECT code, name_ar, home_fee, desk_fee FROM wilayas ORDER BY code')).rows);
}));

app.patch('/api/wilayas/:code', ...admin, wrap(async (req, res) => {
  await pool.query('UPDATE wilayas SET home_fee = $2, desk_fee = $3 WHERE code = $1',
    [int(req.params.code, 'الولاية', 1), int(req.body.home_fee, 'سعر المنزل'), int(req.body.desk_fee, 'سعر المكتب')]);
  res.json({ ok: true });
}));

const PRODUCT_SQL = `SELECT p.id, p.title, p.commercial_title, p.base_price, p.suggested_price, p.stock_qty, p.hook, p.description, p.is_active,
  COALESCE((SELECT json_agg(url ORDER BY position) FROM product_images i WHERE i.product_id = p.id), '[]'::json) AS images FROM products p`;

app.get('/api/products', auth, wrap(async (req, res) => {
  const q = String(req.query.q || '').slice(0, 60).replace(/[%_\\]/g, '\\$&');
  const rows = await asUser(req.user, async c => (await c.query(
    `${PRODUCT_SQL} WHERE ($1 OR p.is_active) AND ($2 = '' OR p.title ILIKE '%' || $2 || '%') ORDER BY p.id DESC`,
    [req.user.role === 'admin', q])).rows);
  res.json(rows);
}));

const imgs = v => { if (!Array.isArray(v) || v.length > 8 || v.some(u => typeof u !== 'string' || !/^\/uploads\/[\w-]+\.(jpg|png|webp)$/.test(u))) throw bad('قائمة الصور غير صالحة'); return v; };
const setImages = async (c, id, list) => {
  await c.query('DELETE FROM product_images WHERE product_id = $1', [id]);
  for (const [i, url] of list.entries()) await c.query('INSERT INTO product_images (product_id, url, position) VALUES ($1, $2, $3)', [id, url, i]);
};

app.post('/api/products', ...admin, wrap(async (req, res) => {
  const b = req.body, title = str(b.title, 'اسم المنتج', 150);
  const list = imgs(b.images ?? []);
  const id = await asUser(req.user, async c => {
    const { rows: [r] } = await c.query(
      `INSERT INTO products (title, commercial_title, base_price, suggested_price, stock_qty, hook, description)
       VALUES ($1, $1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, int(b.base_price, 'سعر الجملة', 1), int(b.suggested_price, 'السعر المقترح', 1), int(b.stock_qty, 'الكمية'), String(b.hook || '').slice(0, 500), String(b.description || '').slice(0, 5000)]);
    await setImages(c, r.id, list);
    return r.id;
  });
  res.status(201).json({ id });
}));

app.patch('/api/products/:id', ...admin, wrap(async (req, res) => {
  const id = int(req.params.id, 'المعرّف', 1), b = req.body;
  const title = opt(b.title, v => str(v, 'اسم المنتج', 150));
  const list = opt(b.images, imgs);
  await asUser(req.user, async c => {
    await c.query(
      `UPDATE products SET title = COALESCE($2, title), commercial_title = COALESCE($2, commercial_title),
         base_price = COALESCE($3, base_price), suggested_price = COALESCE($4, suggested_price), stock_qty = COALESCE($5, stock_qty),
         hook = COALESCE($6, hook), description = COALESCE($7, description) WHERE id = $1`,
      [id, title, opt(b.base_price, v => int(v, 'سعر الجملة', 1)), opt(b.suggested_price, v => int(v, 'السعر المقترح', 1)),
       opt(b.stock_qty, v => int(v, 'الكمية')), opt(b.hook, v => String(v).slice(0, 500)), opt(b.description, v => String(v).slice(0, 5000))]);
    if (list) await setImages(c, id, list);
  });
  res.json({ ok: true });
}));

app.patch('/api/products/:id/stock', ...admin, wrap(async (req, res) => {
  const { rows: [r] } = await asUser(req.user, c => c.query('UPDATE products SET stock_qty = $2 WHERE id = $1 RETURNING stock_qty',
    [int(req.params.id, 'المعرّف', 1), int(req.body.stock_qty, 'الكمية')]));
  if (!r) throw bad('المنتج غير موجود', 404);
  res.json(r);
}));

app.delete('/api/products/:id', ...admin, wrap(async (req, res) => {
  await asUser(req.user, c => c.query('UPDATE products SET is_active = false WHERE id = $1', [int(req.params.id, 'المعرّف', 1)]));
  res.json({ ok: true });
}));

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const mkUpload = size => multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: size, files: 1 },
  fileFilter: (_r, f, cb) => cb(EXT[f.mimetype] ? null : bad('صور JPG أو PNG أو WEBP فقط'), !!EXT[f.mimetype]),
});
const upload = mkUpload(5 * 1024 * 1024), avatarUpload = mkUpload(2 * 1024 * 1024);
async function saveImage(file) {
  const id = crypto.randomUUID();
  await pool.query('INSERT INTO uploads (id, mime, data) VALUES ($1, $2, $3)', [id, file.mimetype, file.buffer]);
  return `/uploads/${id}.${EXT[file.mimetype]}`;
}
app.post('/api/uploads', ...admin, upload.single('image'), wrap(async (req, res) => {
  if (!req.file) throw bad('لم يصل أي ملف');
  res.status(201).json({ url: await saveImage(req.file) });
}));

app.post('/api/me/avatar', auth, avatarUpload.single('avatar'), wrap(async (req, res) => {
  if (!req.file) throw bad('لم يصل أي ملف');
  const { rows: [old] } = await pool.query('SELECT avatar_url FROM users WHERE id = $1', [req.user.id]);
  const url = await saveImage(req.file);
  await pool.query('UPDATE users SET avatar_url = $2 WHERE id = $1', [req.user.id, url]);
  const oldId = old && /^\/uploads\/([0-9a-f-]{36})\./.exec(old.avatar_url || '');
  if (oldId) await pool.query('DELETE FROM uploads WHERE id = $1', [oldId[1]]);
  res.json({ url });
}));

const ORDER_SQL = `SELECT o.id, o.status, o.quantity, o.customer_name, o.customer_phone, o.wilaya_code, w.name_ar AS wilaya, o.commune, o.address,
  o.delivery_type, o.base_price, o.resale_price, o.delivery_fee, o.total_to_collect, o.profit_amount, o.amount_collected, o.admin_note, o.created_at,
  p.title AS product, u.full_name AS affiliate
  FROM orders o JOIN products p ON p.id = o.product_id JOIN wilayas w ON w.code = o.wilaya_code JOIN users u ON u.id = o.affiliate_id`;

app.post('/api/orders', ...affiliate, wrap(async (req, res) => {
  const b = req.body;
  const v = [int(b.product_id, 'المنتج', 1), int(b.quantity, 'الكمية', 1), int(b.resale_price, 'سعر البيع'),
    str(b.customer_name, 'اسم الزبون', 100), str(b.customer_phone, 'هاتف الزبون', 20), int(b.wilaya_code, 'الولاية', 1),
    oneOf(b.delivery_type, ['home', 'desk'], 'نوع التوصيل'), str(b.commune, 'البلدية', 100), str(b.address, 'العنوان', 300)];
  const row = await asUser(req.user, async c => (await c.query(
    `INSERT INTO orders (affiliate_id, product_id, quantity, resale_price, customer_name, customer_phone, wilaya_code, delivery_type, commune, address)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`, [req.user.id, ...v])).rows[0]);
  res.status(201).json(row);
}));

app.get('/api/orders', auth, wrap(async (req, res) => {
  const rows = await asUser(req.user, async c => (await c.query(
    `${ORDER_SQL} WHERE ($1::text IS NULL OR o.status = $1::order_status) ORDER BY o.id DESC LIMIT 200`, [req.query.status || null])).rows);
  res.json(rows);
}));

app.patch('/api/orders/:id/status', ...admin, wrap(async (req, res) => {
  const status = oneOf(req.body.status, ['pending', 'shipped', 'delivered', 'cancelled', 'retour'], 'الحالة');
  const row = await asUser(req.user, async c => (await c.query(
    `UPDATE orders SET status = $2, amount_collected = COALESCE($3, amount_collected), admin_note = COALESCE($4, admin_note)
     WHERE id = $1 RETURNING id, status, amount_collected`,
    [int(req.params.id, 'المعرّف', 1), status, opt(req.body.amount_collected, v => int(v, 'المبلغ المحصَّل')), opt(req.body.admin_note, v => String(v).slice(0, 500))])).rows[0]);
  if (!row) throw bad('الطلب غير موجود', 404);
  res.json(row);
}));

// ───────── المحفظة والسحب ─────────
app.get('/api/wallet', auth, wrap(async (req, res) => {
  const { rows: [w] } = await pool.query(
    `SELECT balance, total_earned, pending_balance FROM affiliate_balances WHERE affiliate_id = $1`, [req.user.id]);
  const { rows: payouts } = await pool.query(
    `SELECT id, amount, status, method, account, created_at, paid_at FROM payout_requests WHERE affiliate_id = $1 ORDER BY id DESC LIMIT 20`, [req.user.id]);
  res.json({ balance: w?.balance || 0, total_earned: w?.total_earned || 0, pending_balance: w?.pending_balance || 0, payouts });
}));

app.post('/api/payouts', affiliate, wrap(async (req, res) => {
  const amount = int(req.body.amount, 'المبلغ', 1000);
  const row = await asUser(req.user, async c => {
    const { rows: [w] } = await c.query('SELECT balance, payout_method, payout_account FROM affiliate_balances ab JOIN users u ON u.id = ab.affiliate_id WHERE ab.affiliate_id = $1 FOR UPDATE', [req.user.id]);
    if (!w || w.balance < amount) throw bad('رصيدك غير كافٍ', 400);
    if (!w.payout_method || !w.payout_account) throw bad('يرجى ضبط معلومات الدفع في ملفك الشخصي أولاً', 400);

    await c.query('UPDATE affiliate_balances SET balance = balance - $2 WHERE affiliate_id = $1', [req.user.id, amount]);
    const { rows: [p] } = await c.query(
      `INSERT INTO payout_requests (affiliate_id, amount, method, account, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
      [req.user.id, amount, w.payout_method, w.payout_account]);
    return p;
  });
  res.status(201).json(row);
}));

// ───────── معالج الأخطاء العام وتشغيل الخادم ─────────
app.use((e, req, res, next) => {
  if (e.code === '22P02') return res.status(400).json({ error: 'قيمة غير صالحة' });
  if (e.code === '42501') return res.status(403).json({ error: 'غير مسموح' });
  if (e.http) return res.status(e.http).json({ error: e.message });
  console.error(e);
  res.status(500).json({ error: 'خطأ في الخادم' });
});

async function ensureAdmin() {
  const { ADMIN_PHONE: phone, ADMIN_EMAIL: email, ADMIN_PASSWORD: pass, ADMIN_NAME: name = 'مدير المنصة', ADMIN_USERNAME: un = 'admin' } = process.env;
  if (!phone || !email || !pass) return;
  const { rows: [a] } = await pool.query("SELECT 1 FROM users WHERE role = 'admin'");
  if (a) return;
  if (pass.length < 10) return console.error('ADMIN_PASSWORD قصيرة (10 أحرف على الأقل). لم يُنشأ المدير.');
  await pool.query(
    `INSERT INTO users (role, full_name, username, phone, email, email_verified_at, password_hash, is_active) VALUES ('admin', $1, $2, $3, $4, now(), $5, true)`,
    [name, un.toLowerCase(), phone, email.toLowerCase(), await bcrypt.hash(pass, 12)]);
  console.log('تم إنشاء حساب المدير الرئيسي');
}

app.listen(process.env.PORT || 3000, () => {
  console.log('ELDOOB API جاهز');
  startMailer();
  ensureAdmin().catch(e => console.error('ensureAdmin:', e.message));
});
