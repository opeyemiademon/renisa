import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY || '');
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@myschoolsms.cloud';
const FROM_NAME = process.env.FROM_NAME || 'RENISA';
export const sendEmail = async (to, subject, html) => {
    try {
        const { error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to,
            subject,
            html,
        });
        if (error) {
            console.error('Email send error:', error);
            return false;
        }
        return true;
    }
    catch (err) {
        console.error('Email service error:', err);
        return false;
    }
};
export const sendBulkEmail = async (recipients, subject, html) => {
    const batchSize = 100;
    for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        await Promise.allSettled(batch.map(to => sendEmail(to, subject, html)));
    }
};
export const bulkEmailTemplate = (subject, body) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#1a6b3a; padding:28px 30px; text-align:center;">
      <h1 style="color:#d4a017; margin:0; font-size:28px; letter-spacing:1px;">RENISA</h1>
      <p style="color:#ffffff; margin:6px 0 0; font-size:13px;">Retired Nigerian Women &amp; Men Sports Association</p>
    </div>
    <div style="padding:32px 30px;">
      <h2 style="color:#1a6b3a; margin-top:0; font-size:20px;">${subject}</h2>
      <div style="color:#374151; font-size:15px; line-height:1.7;">
        ${body}
      </div>
    </div>
    <div style="background:#f0f8f0; border-top:1px solid #d1fae5; padding:20px 30px; text-align:center;">
      <p style="color:#6b7280; margin:0; font-size:12px;">
        © ${new Date().getFullYear()} RENISA. All rights reserved.<br/>
        This message was sent to you as a RENISA member.
      </p>
    </div>
  </div>
</body>
</html>
`;
export const welcomeTemplate = (name, memberNumber) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to RENISA</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden;">
    <div style="background:#1a6b3a; padding:30px; text-align:center;">
      <h1 style="color:#d4a017; margin:0;">RENISA</h1>
      <p style="color:#fff; margin:5px 0 0;">Retired Nigerian  Men & Women Sports Association</p>
    </div>
    <div style="padding:30px;">
      <h2 style="color:#1a6b3a;">Welcome, ${name}!</h2>
      <p>Your membership registration has been received. Your membership number is:</p>
      <div style="background:#f0f8f0; border:2px solid #1a6b3a; border-radius:6px; padding:15px; text-align:center; margin:20px 0;">
        <strong style="font-size:24px; color:#1a6b3a; letter-spacing:2px;">${memberNumber}</strong>
      </div>
      <p>Please keep this number safe as you will need it for future reference.</p>
      <p>You can now log in to the member portal to access your dashboard and all member services.</p>
    </div>
    <div style="background:#1a6b3a; padding:20px; text-align:center;">
      <p style="color:#fff; margin:0; font-size:12px;">© ${new Date().getFullYear()} RENISA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
export const paymentReceiptTemplate = (name, amount, type, ref) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Payment Receipt - RENISA</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden;">
    <div style="background:#1a6b3a; padding:30px; text-align:center;">
      <h1 style="color:#d4a017; margin:0;">RENISA</h1>
      <p style="color:#fff; margin:5px 0 0;">Payment Receipt</p>
    </div>
    <div style="padding:30px;">
      <h2 style="color:#1a6b3a;">Payment Confirmed</h2>
      <p>Dear ${name}, your payment has been successfully processed.</p>
      <table style="width:100%; border-collapse:collapse; margin:20px 0;">
        <tr><td style="padding:10px; border-bottom:1px solid #eee; color:#666;">Payment Type</td><td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">${type}</td></tr>
        <tr><td style="padding:10px; border-bottom:1px solid #eee; color:#666;">Amount</td><td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold; color:#1a6b3a;">₦${amount.toLocaleString()}</td></tr>
        <tr><td style="padding:10px; border-bottom:1px solid #eee; color:#666;">Reference</td><td style="padding:10px; border-bottom:1px solid #eee;">${ref}</td></tr>
        <tr><td style="padding:10px; color:#666;">Date</td><td style="padding:10px;">${new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}</td></tr>
      </table>
    </div>
    <div style="background:#1a6b3a; padding:20px; text-align:center;">
      <p style="color:#fff; margin:0; font-size:12px;">© ${new Date().getFullYear()} RENISA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
export const idCardStatusTemplate = (name, status, reason) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ID Card Status - RENISA</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden;">
    <div style="background:#1a6b3a; padding:30px; text-align:center;">
      <h1 style="color:#d4a017; margin:0;">RENISA</h1>
      <p style="color:#fff; margin:5px 0 0;">ID Card Request Update</p>
    </div>
    <div style="padding:30px;">
      <h2 style="color:#1a6b3a;">ID Card Request ${status === 'approved' ? 'Approved' : 'Update'}</h2>
      <p>Dear ${name},</p>
      <p>Your ID card request has been <strong style="color:${status === 'approved' ? '#1a6b3a' : status === 'rejected' ? '#c0392b' : '#d4a017'}">${status}</strong>.</p>
      ${reason ? `<div style="background:#fff3f3; border-left:4px solid #c0392b; padding:15px; margin:15px 0;"><strong>Reason:</strong> ${reason}</div>` : ''}
      ${status === 'approved' ? '<p>You can now log in to the member portal to download your ID card.</p>' : ''}
    </div>
    <div style="background:#1a6b3a; padding:20px; text-align:center;">
      <p style="color:#fff; margin:0; font-size:12px;">© ${new Date().getFullYear()} RENISA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
export const donationInvoiceTemplate = (donorName, invoiceNumber, amount, paymentLink) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Donation Invoice - RENISA</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden;">
    <div style="background:#1a6b3a; padding:30px; text-align:center;">
      <h1 style="color:#d4a017; margin:0;">RENISA</h1>
      <p style="color:#fff; margin:5px 0 0;">Donation Invoice</p>
    </div>
    <div style="padding:30px;">
      <h2 style="color:#1a6b3a;">Invoice #${invoiceNumber}</h2>
      <p>Dear ${donorName}, thank you for your generous support.</p>
      <table style="width:100%; border-collapse:collapse; margin:20px 0;">
        <tr><td style="padding:10px; border-bottom:1px solid #eee; color:#666;">Invoice Number</td><td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">${invoiceNumber}</td></tr>
        <tr><td style="padding:10px; border-bottom:1px solid #eee; color:#666;">Amount Due</td><td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold; color:#1a6b3a;">₦${amount.toLocaleString()}</td></tr>
      </table>
      <div style="text-align:center; margin:25px 0;">
        <a href="${paymentLink}" style="background:#d4a017; color:#fff; padding:15px 30px; text-decoration:none; border-radius:5px; font-size:16px; font-weight:bold;">Pay Now</a>
      </div>
    </div>
    <div style="background:#1a6b3a; padding:20px; text-align:center;">
      <p style="color:#fff; margin:0; font-size:12px;">© ${new Date().getFullYear()} RENISA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
export const passwordResetTemplate = (name, resetUrl) => {
    const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const safeUrl = resetUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reset your password - RENISA</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden;">
    <div style="background:#1a6b3a; padding:30px; text-align:center;">
      <h1 style="color:#d4a017; margin:0;">RENISA</h1>
      <p style="color:#fff; margin:5px 0 0;">Password reset</p>
    </div>
    <div style="padding:30px;">
      <p style="color:#374151;">Hello ${safeName},</p>
      <p style="color:#374151;">We received a request to reset the password for your member account. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
      <div style="text-align:center; margin:28px 0;">
        <a href="${safeUrl}" style="background:#d4a017; color:#0d4a25; padding:14px 28px; text-decoration:none; border-radius:8px; font-size:16px; font-weight:bold; display:inline-block;">Reset password</a>
      </div>
      <p style="color:#6b7280; font-size:13px;">If the button does not work, copy and paste this link into your browser:</p>
      <p style="color:#1a6b3a; font-size:12px; word-break:break-all;">${safeUrl}</p>
      <p style="color:#9ca3af; font-size:12px; margin-top:24px;">If you did not request this, you can ignore this email. Your password will stay the same.</p>
    </div>
    <div style="background:#1a6b3a; padding:20px; text-align:center;">
      <p style="color:#fff; margin:0; font-size:12px;">© ${new Date().getFullYear()} RENISA. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};
//# sourceMappingURL=emailService.js.map