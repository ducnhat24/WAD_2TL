const UserService = require('../model/UserService');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers(req.query);
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
            const user = await UserService.getUserByID(req.user.userID);
            console.log(user);
            if (user.status === 'error') {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'User authenticated',
                user: user.data,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async editUser(req, res) {
        try {
            const { type, data } = req.query;
            const id = req.body.id;
            const query = { type, data, id };
            const status = await UserService.editUserInfo(query);
            return res.status(200).json(status);
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    }

    async deleteUser(req, res) {
        const user = req.user;
        if (user.userRole.toLowerCase() !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to access this resource'
            });
        }
        const id = req.params.id;
        try {
            const status = await UserService.deleteUser(id, user.userID);
            return res.status(200).json(status);
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    }

    async addUser(req, res) {
        const { name, phone, email, address, role, dateOfBirth } = req.body;
        try {
            const status = await UserService.addUser({ name, phone, email, address, role, dateOfBirth });
            return res.status(200).json(status);
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    }

    async editUserByAdmin(req, res) {
        const user = req.user;
        if (user.userRole && user.userRole.toLowerCase() !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to access this resource'
            });
        }
        const { type, data } = req.body;
        const id = req.params.id;
        const query = { type, data, id };
        try {
            const status = await UserService.editUserByAdmin(query, user.userID);
            return res.status(200).json(status);
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    }

}

module.exports = new UserController;