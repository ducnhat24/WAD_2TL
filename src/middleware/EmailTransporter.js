const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Địa chỉ email
    pass: process.env.EMAIL_PASS, // App Password
  },
  // logger: true, // Ghi log vào console
  // debug: true,  // Bật chế độ debug
});

module.exports = emailTransporter;
