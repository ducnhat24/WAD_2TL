const UserService = require('../model/UserService');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            if (users.status === 'error') {
                return res.status(404).json(users);
            }
            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async login(req, res) {
        try {
            const { userAccount, userPassword } = req.body;
            console.log(userAccount, userPassword);
            const user = await UserService.login(userAccount, userPassword);
            if (user.status === 'error') {
                return res.status(404).json(user);
            }
            res.cookie('accessToken', user.accessToken, { httpOnly: true });
            res.cookie('refreshToken', user.refreshToken, { httpOnly: true });
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async auth(req, res) {
        try {
            return res.status(200).json({
                status: 'success',
                message: 'User authenticated',
                user: req.user,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}

module.exports = new UserController;