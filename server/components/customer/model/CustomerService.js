
const { generateAccessToken, generateRefreshToken } = require('../../../middleware/JWTAction.js');

const Customer = require('../schema/Customer.js');
const bcrypt = require('bcrypt');

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

class CustomerService {

    async addUser(user) {
        try {
            const { username, email, password } = user;
            const existingUser = await Customer.findOne({ $or: [{ email: email }, { name: username }] });
            if (existingUser) {
                return {
                    status: "error",
                    message: "Customer already exists"
                };
            }
            const passwordHash = await hashPassword(password);

            const newUser = new Customer({
                name: username,
                email: email,
                password: passwordHash,
            });
            await newUser.save();
            return {
                status: "success",
                message: "Customer added successfully"
            };
        }
        catch (error) {
            return {
                status: "error",
                message: "Error adding user"
            };
        }
    }

    async login({ useraccount, password }) {
        try {
            const existingUser = await Customer.findOne({ $or: [{ email: useraccount }, { name: useraccount }] });
            if (!existingUser) {
                return {
                    status: "error",
                    msg: "Invalid credentials"
                };
            }
            const checkPassword = await bcrypt.compare(password, existingUser.password);
            if (checkPassword === false) {
                return {
                    status: "error",
                    msg: "Wrong password",
                };
            }
            const payload = {
                id: existingUser._id,
            };
            const refreshToken = generateRefreshToken(payload);
            await Customer.updateOne({ _id: existingUser._id }, { refreshToken: refreshToken });
            return {
                status: "success",
                accessToken: generateAccessToken(payload),
                refreshToken: refreshToken,
                msg: "Login successful",
                user: existingUser,
            };
        }
        catch (error) {
            return {
                status: "error",
                msg: error.message
            };
        }
    }

    async loginWithGoogle(googleProfile) {
        try {
            const { id, customerEmail, name } = googleProfile;
            console.log('Google Profile:', googleProfile);
            if (!customerEmail) {
                throw new Error('Email is required');
            }
            // Kiểm tra xem user đã tồn tại chưa bằng email
            let user = await Customer.findOne({ customerEmail: customerEmail });
            if (!user) {
                // Nếu chưa tồn tại, tạo mới user
                user = new Customer({
                    googleId: id,
                    customerEmail: customerEmail,
                    name: name,
                });
                await user.save(); // Save the user if new
            } else {
                // Nếu đã tồn tại user, kiểm tra nếu googleId chưa được lưu
                if (user.googleId !== id) {
                    // Update user nếu googleId khác
                    user.googleId = id;
                    user.name = name;  // You can also update the name if necessary
                    await user.save(); // Save updated user
                }
            }

            const payload = { id: user._id };

            // Tạo accessToken và refreshToken
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            // Lưu refreshToken vào cơ sở dữ liệu
            user.refreshToken = refreshToken;
            await user.save(); // Save the refreshToken

            return {
                status: "success",
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: user,
            };
        } catch (error) {
            console.error("Error in loginWithGoogle:", error);
            return {
                status: "error",
                message: error.message,
            };
        }
    }


    async logout(refreshToken) {
        try {
            const user = await Customer.findOne({ refreshToken: refreshToken });
            if (!user) {
                return {
                    status: "error",
                    message: "Invalid refresh token"
                };
            }

            user.refreshToken = "";
            await user.save();
        }
        catch (error) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
}

module.exports = new CustomerService;