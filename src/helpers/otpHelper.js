const otpCache = new Map();
const emailTransporter = require('../middleware/EmailTransporter.js'); // Đường dẫn đúng đến file config

exports.generateOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào cache
    otpCache.set(email, otp);

    // Gửi OTP qua email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`OTP for ${email} sent: ${otp}`);

    // Xóa OTP sau 5 phút
    setTimeout(() => otpCache.delete(email), 5 * 60 * 1000);

    return otp; // Có thể trả về OTP ID nếu bạn cần
};

exports.verifyOtpCode = async (otp) => {
    for (const [email, storedOtp] of otpCache.entries()) {
        if (storedOtp === otp) {
            otpCache.delete(email);
            return true;
        }
    }
    return false;
};