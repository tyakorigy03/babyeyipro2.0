'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Reusable Nodemailer transporter.
 * Reads all config from .env so nothing is hardcoded.
 */
const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST,
  port:   parseInt(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === 'true',   // true → 465, false → STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Verify the SMTP connection at startup (non-fatal — just warns).
 */
const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('✅  Mailer ready  →  %s', process.env.MAIL_HOST);
  } catch (err) {
    console.warn('⚠️   Mailer not configured:', err.message);
  }
};

/**
 * Generic send-mail helper.
 *
 * @param {Object} opts
 * @param {string}          opts.to       – recipient address(es)
 * @param {string}          opts.subject  – email subject
 * @param {string}         [opts.text]    – plain-text body
 * @param {string}         [opts.html]    – HTML body (preferred)
 * @returns {Promise<Object>} nodemailer info object
 */
const sendMail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from:    process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  });
  return info;
};

/* ── Ready-made notification helpers ─────────────────────────── */

/**
 * Send a welcome / account-created email.
 */
const sendWelcomeEmail = ({ to, name }) =>
  sendMail({
    to,
    subject: 'Welcome to BabyeyiPro 🎉',
    html: `
      <h2>Hello, ${name}!</h2>
      <p>Your account has been created on <strong>BabyeyiPro</strong>.</p>
      <p>Log in at <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>
    `,
  });

/**
 * Send a password-reset OTP email.
 */
const sendPasswordResetEmail = ({ to, name, otp }) =>
  sendMail({
    to,
    subject: 'BabyeyiPro – Password Reset Code',
    html: `
      <h2>Hello, ${name}!</h2>
      <p>Your password reset code is:</p>
      <h1 style="letter-spacing:8px;color:#1E3A5F;">${otp}</h1>
      <p>This code expires in <strong>15 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });

/**
 * Send a generic notification email.
 */
const sendNotificationEmail = ({ to, subject, message }) =>
  sendMail({
    to,
    subject,
    html: `<p>${message}</p>`,
  });

module.exports = {
  transporter,
  verifyMailer,
  sendMail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendNotificationEmail,
};
