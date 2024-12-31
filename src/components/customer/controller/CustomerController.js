const CustomerService = require('../model/CustomerService');

class CustomerController {
    showProfile(req, res) {
        res.render('profile');
    }

    showSignup(req, res) {
        res.render('signup');
    }

    showLogin(req, res) {
        res.render('login');
    }

    async addUser(req, res) {
        const { username, email, password } = req.body;
        const status = await CustomerService.addUser({ username, email, password });
        res.json(status);
    }

    async getUsers(req, res) {
        const users = await CustomerService.getUsers();
        res.json(users);
    }

    async login(req, res) {
        const { useraccount, password } = req.body;
        const user = await CustomerService.login({ useraccount, password });
        const options = {
            sameSite: "none",
            secure: true,
        };
        res.cookie('accessToken', user.accessToken, options);
        res.cookie('refreshToken', user.refreshToken, options);
        res.json(user);
    }

    async logout(req, res) {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        const user = await CustomerService.logout(refreshToken);

        return res.json({
            status: 'success',
            msg: 'Logged out'
        });
    }

    async auth(req, res) {
        return res.json({
            status: 'success',
            user: req.user,
            msg: 'Authenticated'
        });

    }

    async getAllUsers(req, res) {
        try {
            const status = await CustomerService.getAllUsers();
            if (status.status === 'success') {
                return res.status(200).json(status);
            }

            return res.status(400).json(status);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                msg: 'Internal server error'
            });
        }
    }
}

module.exports = new CustomerController;