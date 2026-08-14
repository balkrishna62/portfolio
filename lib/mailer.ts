import nodemailer from 'nodemailer';

// Configure the nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email notification to the site administrator (you).
 * 
 * @param subject The subject line of the email
 * @param text The body content of the email
 */
export async function sendEmailNotification(subject: string, text: string) {
  // If credentials are not set, fail gracefully (useful for local dev without env vars)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ SMTP credentials (EMAIL_USER, EMAIL_PASS) are missing. Email not sent.');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Notification" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send it to yourself
      subject,
      text,
    });
    console.log('✅ Email notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    throw error;
  }
}
