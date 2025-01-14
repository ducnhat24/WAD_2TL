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
    async getAllUsers(query) {
        const { role } = query;
        try {
            const queryForFind = role ? { userRole: role } : {};
            const users = await User.find(queryForFind);

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
                accessToken: generateAccessToken({ userID: user._id, userRole: user.userRole }),
                refreshToken: generateRefreshToken({ userID: user._id, userRole: user.userRole }),
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

    async editUserInfo(query) {
        // console.log(query);
        const { type, data, id } = query;
        const userData = await User.findOne({ _id: id });

        if (!userData) {
            return {
                status: 'error',
                message: 'User not found'
            }
        }
        userData[type] = data
        await userData.save();
        return {
            status: 'success',
            message: 'Update user information successfully'
        }
    }

    async deleteUser(id, userID) {
        if (id === userID) {
            return {
                status: 'error',
                message: 'Cannot delete yourself!'
            }
        }
        const user = await User.findOne({ _id: id });
        if (!user) {
            return {
                status: 'error',
                message: 'User not found'
            }
        }
        await User.deleteOne({ _id: id });
        return {
            status: 'success',
            message: 'Delete user successfully'
        }
    }

    async addUser({ name, phone, email, address, role, dateOfBirth }) {
        try {
            const userFind = await User.findOne({ $and: [{ userName: name }, { userPhone: phone }] });
            if (userFind) {
                return {
                    status: 'error',
                    message: 'User already exists'
                }
            }

            const password = await hashPassword('1');
            const newUser = new User({
                userName: name,
                userPhone: phone,
                userEmail: email,
                userAddress: address,
                userRole: role,
                userDateOfBirth: dateOfBirth || '',
                userPassword: password,
            });

            await newUser.save();

            return {
                status: 'success',
                message: 'Add new user successfully'
            }
        }
        catch (err) {
            return {
                status: 'error',
                message: err.message
            }
        }
    }

    async editUserByAdmin(query, userID) {
        const { type, data, id } = query;
        if (id === userID) {
            return {
                status: 'error',
                message: 'Cannot edit yourself in this page!'
            }
        }
        const user = await User.findOne({ _id: id });
        const attribute = 'user' + type.slice(0, 1).toUpperCase() + type.slice(1);
        if (!user) {
            return {
                status: 'error',
                message: 'User not found'
            }
        }
        user[attribute] = data;
        await user.save();
        return {
            status: 'success',
            message: `Update ${user.userName}'s ${type} user successfully`,
        };
    }

    async logout(userID) {
        try {
            const user = await User.findOne({ _id: userID });
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not found'
                }
            }

            user.refreshToken = null;

            await user.save();
            return {
                status: 'success',
                message: 'Logout successfully'
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async viewListOrder(userID, query) {
        try {
            const user = await User.findOne({ _id: userID });
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not found'
                }
            }

            const orders = await Promise.all(user.userListOrder.map(async (item) => {
                const data = await require('../../customer/model/OrderService').getOrderByID(item.orderID);
                let order = data.data;
                order.shipper = {
                    _id: user._id,
                    userName: user.userName,
                    userEmail: user.userEmail,
                    userPhone: user.userPhone,
                    userDateOfBirth: user.userDateOfBirth,
                };
                return order;
            }));

            return {
                status: 'success',
                message: 'Get list order successfully',
                data: orders
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }

    async acceptOrder(userID, orderID) {
        try {
            const user = await User.findOne({ _id: userID });
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not found'
                }
            }

            const status = await require('../../customer/model/OrderService').addShipperOrder(orderID, userID);

            if (status.status !== 'success') {
                return {
                    status: 'error',
                    message: status.message
                }
            }


            const order = {
                orderID,
                acceptanceDateTime: new Date(),
            }

            user.userListOrder.push(order);
            await user.save();


            return {
                status: 'success',
                message: 'Accept order successfully'
            }

        }
        catch (err) {
            return {
                status: 'error',
                message: err.message
            }
        }
    }
}

module.exports = new UserService;