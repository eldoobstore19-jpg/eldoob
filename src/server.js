import pg from 'pg';
import jwt from 'jsonwebtoken';

// Neon (وأمثاله) يقطع الاتصالات الخاملة عند إيقاف الحاسوب تلقائياً: لا بد من معالج أخطاء كي لا ينهار الخادم.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,   // أول اتصال بعد خمول قد يحتاج بضع ثوانٍ
});
pool.on('error', e => console.error('pg pool error:', e.message));

// مصادقة المستخدم عبر JWT وتثبيت البيانات في الطلب
export function authUser(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'مطلوب تسجيل الدخول' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'جلسة غير صالحة أو انتهت صلاحيتها' });
  }
}

// يُنفّذ العملية داخل معاملة بصلاحيات المستخدم الحالي، فتعمل سياسات RLS في قاعدة البيانات.
// حتى لو أخطأ مبرمج في استعلام، لا يستطيع المسوّق قراءة بيانات غيره.
export async function asUser(user, fn) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    await c.query('SET LOCAL ROLE app_user');
    await c.query("SELECT set_config('app.user_id', $1, true), set_config('app.role', $2, true)", [String(user.id), user.role]);
    const out = await fn(c);
    await c.query('COMMIT');
    return out;
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}
