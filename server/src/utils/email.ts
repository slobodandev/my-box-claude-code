import nodemailer from 'nodemailer';

export async function sendEmail(to: string, token: string, shareUrl: string): Promise<void> {
  // For development, we'll use a mock email logger
  // In production, configure with real SMTP settings

  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    // Mock email - just log it
    console.log('\n=== EMAIL SENT ===');
    console.log(`To: ${to}`);
    console.log(`Subject: File Sharing Link`);
    console.log(`\nYou've been invited to share files!`);
    console.log(`\nAccess your shared folder here: ${shareUrl}`);
    console.log(`\nYou can upload new files and view previously uploaded files.`);
    console.log('==================\n');
    return;
  }

  // Production email configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@boxapp.com',
    to,
    subject: 'File Sharing Link',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1890ff;">You've been invited to share files!</h2>
        <p>Access your shared folder by clicking the link below:</p>
        <a href="${shareUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1890ff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Access Shared Folder
        </a>
        <p>Or copy this link: <br><code>${shareUrl}</code></p>
        <p>You can upload new files and view previously uploaded files.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e8e8e8;">
        <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
