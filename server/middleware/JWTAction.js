const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../schemas/User');
dotenv.config();

function generateAccessToken(payload) {
    try {
        const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
        return token;
    }
    catch (err) {
        console.log(err);
    }
}

function generateRefreshToken(payload) {
    try {
        const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '5h' });
        return token;
    }
    catch (err) {
        console.log(err);
    }
}

function renewAccessToken(req, res) {
    const isRefreshToken = !req.body.refreshToken;
    if (isRefreshToken) {
        return res.json({ valid: false, msg: "No refresh token" });
    }
    const refreshToken = req.body.refreshToken;
    console.log(refreshToken);
    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
            if (err) {
                return res.json({ valid: false, msg: "Invalid refresh token" });
            }
            const userData = await User.findOne({ _id: user.id });
            console.log(userData);
            console.log(userData.refreshToken);
            if (!userData || userData.refreshToken !== refreshToken) {
                return res.status(403).json({ status: 'error', message: 'Refresh token is invalid' });
            }
            const accessToken = generateAccessToken({ id: userData._id });
            res.cookie('accessToken', accessToken);

            return res.json({
                status: 'success',
                message: 'Access token renewed',
            });
        });
    }
    catch (err) {
        console.log(err);
    }
}

function verifyToken(req, res, next) {
    // console.log(req.cookies);
    try {

        const token = req.cookies.accessToken;
        if (token == null) {
            console.log('no token');
            return renewAccessToken(req, res);
        }


        jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
            if (err) {
                req.isAuthenticated = false;
                return next();
            }

            req.user = user;
            req.isAuthenticated = true;
            next()
        })
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return renewAccessToken(req, res);
        }
    }
}


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
}