const express = require('express');
const userRouter = express.Router();
const { verifyToken } = require('../../../middleware/JWTAction');
const Customer = require('../controller/CustomerController');

userRouter.post('/signup', Customer.addUser);
userRouter.post('/login', Customer.login);
userRouter.post('/logout', Customer.logout);
userRouter.post('/authentication', verifyToken, Customer.auth);

userRouter.get('/cart', Customer.getCart);
userRouter.post('/cart', Customer.addProductToCart);
userRouter.put('/cart', Customer.updateProductInCart);
userRouter.delete('/cart', Customer.removeProductFromCart);


module.exports = userRouter;