import nodemailer from 'nodemailer';

let transporter;

/**
 * Initializes the email transporter. For development, it uses a test account from Ethereal.
 * In production, it would use real SMTP credentials from environment variables.
 */
async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (process.env.NODE_ENV === 'production') {
    // --- PRODUCTION TRANSPORTER ---
    // Replace with your actual email provider's settings (e.g., SendGrid, Mailgun)
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // --- DEVELOPMENT TRANSPORTER (using Ethereal) ---
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
}

/**
 * Sends an order confirmation email.
 * @param {object} user - The user object (with email, first_name).
 * @param {object} order - The order object (with id, total_amount).
 */
export const sendOrderConfirmationEmail = async (user, order) => {
  const mailer = await getTransporter();
  const info = await mailer.sendMail({
    from: '"Electronics Shop" <noreply@electronics-shop.com>',
    to: user.email,
    subject: `Order Confirmation #${order.id}`,
    html: `<h1>Hi ${user.first_name},</h1><p>Thank you for your order! Your order #${order.id} for a total of $${order.total_amount} has been placed successfully.</p>`,
  });

  console.log('Order confirmation email sent. Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

/**
 * Sends a password reset email.
 * @param {object} user - The user object (with email, first_name).
 * @param {string} token - The password reset token.
 */
export const sendPasswordResetEmail = async (user, token) => {
  const mailer = await getTransporter();
  // In a real app, the URL should point to your frontend's reset page
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  const info = await mailer.sendMail({
    from: '"Electronics Shop" <noreply@electronics-shop.com>',
    to: user.email,
    subject: 'Your Password Reset Request',
    html: `<h1>Hi ${user.first_name},</h1><p>You requested a password reset. Please click the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 1 hour.</p>`,
  });

  console.log('Password reset email sent. Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

/**
 * Sends an account verification email.
 * @param {object} user - The user object (with email, first_name).
 * @param {string} token - The verification token.
 */
export const sendVerificationEmail = async (user, token) => {
  const mailer = await getTransporter();
  // The URL should point to your backend's verification endpoint
  const verificationUrl = `http://localhost:3001/api/users/verify-email/${token}`;

  const info = await mailer.sendMail({
    from: '"Electronics Shop" <noreply@electronics-shop.com>',
    to: user.email,
    subject: 'Verify Your Email Address',
    html: `<h1>Welcome, ${user.first_name}!</h1><p>Thank you for registering. Please click the link below to verify your email address:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('Verification email sent. Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};
