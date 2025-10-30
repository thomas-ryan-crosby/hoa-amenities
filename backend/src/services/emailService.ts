import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'NeighbriApp@gmail.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️ SENDGRID_API_KEY not set; email not sent.');
    return;
  }
  
  try {
    await sgMail.send({
      to: payload.to,
      from: FROM_EMAIL,
      subject: payload.subject,
      html: payload.html,
    });
    console.log(`✅ Email sent successfully to ${payload.to}`);
  } catch (error: any) {
    console.error('❌ SendGrid Error:', error.response?.body || error.message);
    // Re-throw so calling code can handle it
    throw error;
  }
}

export function buildVerificationEmail(firstName: string, verifyUrl: string) {
  return {
    subject: 'Verify Your Neighbri Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>Welcome to Neighbri, ${firstName}!</h2>
        <p>Please verify your email to activate your account.</p>
        <p><a href="${verifyUrl}" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">Verify Email</a></p>
        <p>This link expires in 24 hours. If the button doesn't work, copy and paste this URL:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      </div>
    `,
  };
}

export function buildPasswordResetEmail(firstName: string, resetUrl: string) {
  return {
    subject: 'Reset Your Neighbri Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>Password reset request</h2>
        <p>Hi ${firstName}, click the button below to reset your password.</p>
        <p><a href="${resetUrl}" style="background:#355B45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">Reset Password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
  };
}


