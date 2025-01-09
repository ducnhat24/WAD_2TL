const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../components/customer/schema/Customer');
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.json({ status: "error", message: "No refresh token" });
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
            if (err) {
                return res.json({ status: "error", message: "Invalid refresh token" });
            }
            const userData = await User.findOne({ _id: user.id });
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
    try {
        const token = req.cookies.accessToken;
        if (token == null) {
            return renewAccessToken(req, res);
        }


        jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
            if (err) {
                req.isAuthenticated = false;
                return {
                    status: 'error',
                    message: 'Access token is invalid',
                }
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

// async function getUser() {
//     try {

//         const user = await User.findOne({ _id: this.user.id });
//         return user;
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
