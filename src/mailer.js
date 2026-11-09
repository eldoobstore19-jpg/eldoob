const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderNotification = async (toEmail, orderDetails) => {
  try {
    const info = await transporter.sendMail({
      from: `"ELDOOB.DZ" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'طلب جديد عبر منصة ELDOOB.DZ',
      text: `تم استلام طلبك بنجاح!\n\nتفاصيل الطلب:\n${orderDetails}`,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendOrderNotification };
