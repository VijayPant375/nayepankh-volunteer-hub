const nodemailer = require("nodemailer");

/**
 * Singleton Gmail transporter.
 * Credentials are read from env vars so no secrets live in source code.
 *   EMAIL_USER — Gmail address (e.g. noreply@nayepankh.org)
 *   EMAIL_PASS — Gmail App Password (NOT the account password)
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
