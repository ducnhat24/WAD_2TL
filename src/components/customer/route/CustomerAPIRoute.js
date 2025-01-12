const express = require('express');
const customerAPIRoute = express.Router();
const { verifyToken } = require('../../../middleware/JWTAction');
const CustomerController = require('../controller/CustomerController');
const CartController = require('../controller/CartController');
const { authenticateGoogle, handleGoogleCallback } = require('../../../middleware/GoogleOAuth');
const OrderController = require('../controller/OrderController');
const OrderAPIRoute = require('./OrderAPIRoute');
const upload = require("../../../middleware/multer");   

// route that return customer id
customerAPIRoute.get("/id", verifyToken, CustomerController.getCustomerID);

customerAPIRoute.put('/cart', verifyToken, CartController.updateProductInCart);
customerAPIRoute.delete('/cart', CartController.removeProductFromCart);
customerAPIRoute.post('/cart', CartController.addProductToCart);
customerAPIRoute.get('/cart', CartController.getCart);

customerAPIRoute.get('/filter', CustomerController.filterUser);
customerAPIRoute.put('/:id', CustomerController.updateStatusAccountUser);
customerAPIRoute.get('/', CustomerController.getAllUsers);
customerAPIRoute.get('/auth/google', authenticateGoogle);
customerAPIRoute.get('/auth/google/callback', handleGoogleCallback);
customerAPIRoute.post('/signup', CustomerController.addUser);
customerAPIRoute.post('/login', CustomerController.login);
customerAPIRoute.post('/logout', CustomerController.logout);
customerAPIRoute.post('/authentication', verifyToken, CustomerController.auth);


customerAPIRoute.use('/order', OrderAPIRoute);

// Cập nhật avatar
// customerAPIRoute.post("/update-profile/avatar", CustomerController.updateAvatar);
customerAPIRoute.post("/update-profile/avatar", upload.single("avatar"), CustomerController.updateAvatar);

// Cập nhật name
customerAPIRoute.post("/update-profile/name", CustomerController.updateName);

// Bắt đầu cập nhật email (gửi mã xác thực)
customerAPIRoute.post("/update-profile/email/start", CustomerController.startEmailUpdate);

// Hoàn tất cập nhật email (xác thực mã OTP)
customerAPIRoute.post("/update-profile/email/verify", CustomerController.verifyEmailUpdate);

customerAPIRoute.post("/change-password", CustomerController.changePassword);

customerAPIRoute.get("/profile", verifyToken, CustomerController.getUserProfile);

customerAPIRoute.post('/send-otp', CustomerController.sendOtp);
customerAPIRoute.post('/verify-otp', CustomerController.verifyOtp);
customerAPIRoute.post('/reset-password', CustomerController.resetPassword);






module.exports = customerAPIRoute;