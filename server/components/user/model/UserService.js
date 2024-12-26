const User = require('../schema/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../../middleware/JWTAction');

async function hashPassword(password) {
    try {
        const saltRounds = 1; // Độ mạnh của thuật toán (tốn tài nguyên hơn khi tăng số này)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
}

class UserService {
    async getAllUsers() {
        try {
            const users = await User.find();
            if (!users) {
                return {
                    status: 'error',
                    message: 'No user found',
                };
            }

            return {
                status: 'success',
                message: 'Users found',
                data: users,
            };
        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: error.message,
            }
        }
    }

    async login(userAccount, userPassword) {
        try {
            const query = { $or: [{ userName: userAccount }, { userEmail: userAccount }, { userPhone: userAccount }] };
            const user = await User.findOne(query);
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not found',
                };
            }

            if (!await bcrypt.compare(userPassword, user.userPassword)) {
                return {
                    status: 'error',
                    message: 'Password incorrect',
                };
            }

            return {
                status: 'success',
                message: 'User logged in',
                accessToken: generateAccessToken({ userID: user._id }),
                refreshToken: generateRefreshToken({ userID: user._id }),
                data: user,
            };

        }
        catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: error.message,
            };
        }
    }

    async getUserByID(userID) {
        try {
            const user = await User.findOne({ _id: userID });
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not found',
                };
            }

            return {
                status: 'success',
                message: 'User found',
                data: {
                    ...user._doc,
                    userPassword: undefined,
                },
            };

        } catch (error) {
            console.log(error);
            return {
                status: 'error',
                message: error.message,
            };
        }
    }
}

module.exports = new UserService;