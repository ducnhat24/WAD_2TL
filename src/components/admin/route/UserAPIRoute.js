const express = require('express');
const userRouter = express.Router();
const UserController = require('../controller/UserController');
const { verifyToken } = require('../../../middleware/JWTAction');

// userRouter.post('/', UserController.addProduct);
userRouter.post('/edit', UserController.editUser);
userRouter.post('/login', UserController.login);
userRouter.get('/auth', verifyToken, UserController.auth);
userRouter.get('/', UserController.getAllUsers);

module.exports = userRouter;

