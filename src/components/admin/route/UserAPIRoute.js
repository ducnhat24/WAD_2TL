const express = require('express');
const userRouter = express.Router();
const UserController = require('../controller/UserController');
const { verifyToken } = require('../../../middleware/JWTAction');

// userRouter.post('/', UserController.addProduct);
userRouter.post('/edit', verifyToken, UserController.editUser);
userRouter.post('/login', UserController.login);
userRouter.get('/auth', verifyToken, UserController.auth);

userRouter.put('/:id', verifyToken, UserController.editUserByAdmin);
userRouter.delete('/:id', verifyToken, UserController.deleteUser);
userRouter.get('/', UserController.getAllUsers);
userRouter.post('/', UserController.addUser);

module.exports = userRouter;

