import nodemailer from 'nodemailer';
import { pool } from './db.js';

// يرسل رسائل email_outbox. على Render المجاني تُحجب منافذ SMTP، لذلك نفضّل واجهة Brevo عبر HTTPS (BREVO_API_KEY).
// وإن لم يوجد المفتاح نستخدم SMTP عادي (يعمل على VPS أو الحاسوب).
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;
const FROM_NAME = process.env.MAIL_FROM_NAME || 'ELDOOB.DZ';
const MODE = process.env.BREVO_API_KEY ? 'brevo' : process.env.SMTP_HOST ? 'smtp' : 'none';
let smtp;

async function send(m) {
  if (MODE === 'brevo') {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ sender: { name: FROM_NAME, email: FROM_EMAIL }, to: [{ email: m.to_email }], subject: m.subject, textContent: m.body }),
    });
    if (!r.ok) throw new Error(`Brevo ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return;
  }
  smtp ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await smtp.sendMail({ from: `"${FROM_NAME}" <${FROM_EMAIL}>`, to: m.to_email, subject: m.subject, text: m.body });
}

let busy = false;
export async function flushEmails() {
