import pg from 'pg';

// Neon (وأمثاله) يقطع الاتصالات الخاملة عند إيقاف الحاسوب تلقائياً: لا بد من معالج أخطاء كي لا ينهار الخادم.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,   // أول اتصال بعد خمول قد يحتاج بضع ثوانٍ
});
pool.on('error', e => console.error('pg pool error:', e.message));

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
