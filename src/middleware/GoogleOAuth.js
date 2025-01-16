const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Customer = require('../components/customer/schema/Customer');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('./JWTAction');
const UserService = require('../components/customer/model/CustomerService'); // Import UserService

var fetchURL = "https://watch-shop-nine-beryl.vercel.app";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: fetchURL + `/api/customer/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log('Google Profile:', profile);
        console.log('Google Profile Email:', profile.emails[0].value);

        let user = await Customer.findOne({ customerEmail: profile.emails[0].value });
        console.log('After find user');
        console.log('User:', user);
        if (!user) {
            console.log('Creating new user...');
            user = await Customer.create({
                googleId: profile.id,
                customerEmail: profile.emails[0].value,
                customerName: profile.displayName,
                customerPassword: null, // Không có password cho OAuth
            });
            console.log('User được tạo thành công');
        }
        done(null, user);
    } catch (err) {
        console.error('Error in GoogleStrategy:', err);
        done(err, null);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Middleware bảo vệ JWT và xử lý callback Google
function authenticateGoogle(req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

function handleGoogleCallback(req, res, next) {
    passport.authenticate('google', { session: false }, async (err, googleProfile) => {
        if (err || !googleProfile) {
            return res.status(401).json({ message: 'Google authentication failed' });
        }
        // Sử dụng UserService để xử lý login bằng Google
        const result = await UserService.loginWithGoogle(googleProfile);

        if (result.status === "error") {
            return res.status(500).json({ message: result.message });
        }

        // Gửi token về client
        res.cookie('accessToken', result.accessToken, { sameSite: 'none', secure: true });
        res.cookie('refreshToken', result.refreshToken, { sameSite: 'none', secure: true });
        res.redirect(fetchURL + '/?loginSuccess=true'); // Redirect về trang chính hoặc client-side xử lý token
    })(req, res, next);
}

module.exports = { authenticateGoogle, handleGoogleCallback };