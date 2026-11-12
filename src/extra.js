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
