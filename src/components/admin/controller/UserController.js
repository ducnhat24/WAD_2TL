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
            const user = await UserService.login(userAccount, userPassword);
            if (user.status === 'error') {
                return res.status(404).json(user);
            }
            const options = {
                sameSite: "none",
                secure: true,
            };
            res.cookie('accessToken', user.accessToken, options);
            res.cookie('refreshToken', user.refreshToken, options);
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

    async logout(req, res) {
        try {
            const user = req.user;
            const status = await UserService.logout(user.userID);
            if (status.status === 'error') {
                return res.status(404).json(status);
            }
            const options = {
                sameSite: "none",
                secure: true,
            };
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(200).json(status);
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    }

    async viewListOrder(req, res) {
        try {
            const user = req.user;
            const orders = await UserService.viewListOrder(user.userID, req.query);
            if (orders.status === 'error') {
                return res.status(404).json(orders);
            }
            return res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    async acceptOrder(req, res) {
        try {
            const user = req.user;
            const status = await UserService.acceptOrder(user.userID, req.body.orderID);
            return res.status(200).json(status);
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    }

    async changePassword(req, res) {
        try {
            const user = req.user;
            const status = await UserService.changePassword(user.userID, req.body);
            return res.status(200).json(status);
        }
        catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        }
    }

    async updateActivation(req, res) {
        try {
            const user = req.user;
            if (user.userRole.toLowerCase() !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'You do not have permission to access this resource'
                });
            }

            if (req.params.id === user.userID) {
                return res.status(403).json({
                    status: 'error',
                    message: 'You can not deactivate your own account'
                });
            }

            const status = await UserService.updateActivation(req.params.id);
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