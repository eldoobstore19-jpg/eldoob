import nodemailer from 'nodemailer';
import { pool } from './db.js';

// يرسل البريد عبر Brevo (HTTPS) إن وُجد BREVO_API_KEY، وإلا عبر SMTP إن وُجد SMTP_HOST.
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;
const FROM_NAME = process.env.MAIL_FROM_NAME || 'ELDOOB.DZ';
const MODE = process.env.BREVO_API_KEY ? 'brevo' : process.env.SMTP_HOST ? 'smtp' : 'none';
let smtp;

async function send(m) {
  if (MODE === 'none') throw new Error('لم يتم ضبط البريد: أضف BREVO_API_KEY في Render');
  if (MODE === 'brevo') {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({ sender: { name: FROM_NAME, email: FROM_EMAIL }, to: [{ email: m.to_email }], subject: m.subject, textContent: m.body })
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
  if (busy) return;
  busy = true;
  try {
    const { rows } = await pool.query("SELECT * FROM email_outbox WHERE sent_at IS NULL AND attempts < 5 ORDER BY id LIMIT 10");
    for (const em of rows) {
      try {
        await send(em);
        await pool.query("UPDATE email_outbox SET sent_at = now() WHERE id = $1", [em.id]);
      } catch (e) {
        await pool.query("UPDATE email_outbox SET attempts = attempts + 1, last_error = $2 WHERE id = $1", [em.id, e.message]);
      }
    }
  } finally {
    busy = false;
  }
}

export function startMailer() {
  setInterval(() => flushEmails().catch(e => console.error('mailer:', e.message)), 60000);
}
