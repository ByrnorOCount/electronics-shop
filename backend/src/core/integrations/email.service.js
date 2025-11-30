import nodemailer from "nodemailer";
import logger from "../../config/logger.js";
import env from "../../config/env.js";

let transporter;

/**
 * Initializes the email transporter. For development, it uses a test account from Ethereal.
 * In production, it would use real SMTP credentials from environment variables.
 */
async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (env.NODE_ENV === "production") {
    // --- PRODUCTION TRANSPORTER ---
    // Replace with your actual email provider's settings (e.g., SendGrid, Mailgun)
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  } else {
    // --- DEVELOPMENT TRANSPORTER (using Ethereal) ---
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
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
 * Sends an email using the configured transporter.
 * @param {object} mailOptions - Options for nodemailer sendMail.
 * @returns {Promise<void>}
 */
export const sendEmail = async (mailOptions) => {
  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail(mailOptions);

    if (env.NODE_ENV !== "production") {
      logger.info(
        `Email sent. Preview URL: ${nodemailer.getTestMessageUrl(info)}`
      );
    }
  } catch (error) {
    logger.error("Failed to send email:", error);
    // In production, you might want to throw the error to be handled by a monitoring service
  }
};

/**
 * Sends an order confirmation email to the user.
 * @param {object} user - The user object (with email, first_name).
 * @param {object} order - The order object with items.
 */
export const sendOrderConfirmationEmail = async (user, order) => {
  const subject = `Your Order #${order.id} is Confirmed!`;
  const text = `Hi ${user.first_name},\n\nThank you for your order! Your order #${order.id} has been placed successfully.\n\nYou can view your order details here: ${env.FRONTEND_URL}/orders\n\nThanks for shopping with us!`;
  // TODO: Add a more detailed HTML email template
  const html = `<p>Hi ${user.first_name},</p><p>Thank you for your order! Your order #${order.id} has been placed successfully.</p><p>You can view your order details <a href="${env.FRONTEND_URL}/orders">here</a>.</p><p>Thanks for shopping with us!</p>`;

  await sendEmail({
    from: '"Electronics Shop" <noreply@electronics-shop.com>',
    to: user.email,
    subject,
    text,
    html,
  });

  if (env.NODE_ENV !== "production") {
    logger.info(
      `\n--- ORDER CONFIRMATION --- \nUser: ${user.email}\nOrder ID: ${order.id}\nTotal: $${order.total_amount}\n--------------------------\n`
    );
  }
};

/**
 * Sends a password reset email.
 * @param {object} user - The user object (with email, first_name).
 * @param {string} token - The password reset token.
 */
export const sendPasswordResetEmail = async (user, token) => {
  // In a real app, the URL should point to your frontend's reset page
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  await sendEmail({
    from: '"Electronics Shop" <noreply@electronics-shop.com>',
    to: user.email,
    subject: "Your Password Reset Request",
    html: `<h1>Hi ${user.first_name},</h1><p>You requested a password reset. Please click the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 1 hour.</p>`,
  });

  if (env.NODE_ENV !== "production") {
    logger.info(
      `\n--- PASSWORD RESET --- \nUser: ${user.email}\nToken: ${token}\n----------------------\n`
    );
  }
};

/**
 * Sends an account verification email.
 * @param {object} user - The user object (with email, first_name).
 * @param {string} token - The verification token.
 */
export const sendVerificationEmail = async (user, token) => {
  // The URL should point to your backend's verification endpoint
  const verificationUrl = `http://localhost:3001/api/users/verify-email/${token}`;

  await sendEmail({
    from: '"Electronics Shop" <noreply@electronics-shop.com>',
    to: user.email,
    subject: "Verify Your Email Address",
    html: `<h1>Welcome, ${user.first_name}!</h1><p>Thank you for registering. Please click the link below to verify your email address:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  });

  if (env.NODE_ENV !== "production") {
    logger.info(
      `\n--- EMAIL VERIFICATION --- \nUser: ${user.email}\nToken: ${token}\n--------------------------\n`
    );
  }
};

/**
 * Sends a One-Time Password (OTP) for checkout verification.
 * @param {object} user - The user object (with email, first_name).
 * @param {string} otp - The One-Time Password.
 */
export const sendOtpEmail = async (user, otp) => {
  await sendEmail({
    from: '"Electronics Shop" <noreply@electronics-shop.com>',
    to: user.email,
    subject: "Your Checkout Verification Code",
    html: `<h1>Hi ${user.first_name},</h1><p>Your One-Time Password (OTP) for checkout is:</p><h2>${otp}</h2><p>This code will expire in 10 minutes.</p>`,
  });

  if (env.NODE_ENV !== "production") {
    logger.info(
      `\n--- CHECKOUT OTP --- \nUser: ${user.email}\nOTP: ${otp}\n--------------------\n`
    );
  }
};
