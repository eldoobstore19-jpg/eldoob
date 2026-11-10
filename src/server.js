import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import crypto from 'node:crypto';
import { pool, authUser } from './db.js';
import { flushEmails, startMailer } from './mailer.js';

const SECRET = process.env.JWT_SECRET;
if (!SECRET || SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 chars');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((e, req, res, next) => {
  if (e.code === '22P02') return res.status(400).json({ error: 'قيمة غير صالحة' });
  if (e.code === '42501') return res.status(403).json({ error: 'غير مسموح' });
  console.error(e);
  res.status(500).json({ error: 'خطأ في الخادم' });
});

// إنشاء المدير الرئيسي تلقائياً عند أول تشغيل (الاستضافة المجانية بلا طرفية). بعدها احذف ADMIN_PASSWORD من الإعدادات.
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
