
const { generateAccessToken, generateRefreshToken } = require('../../../middleware/JWTAction.js');

const User = require('../../../schemas/Customer.js');
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

class UserService {

    async addUser(user) {
        try {
            const { username, email, password } = user;
            const existingUser = await User.findOne({ $or: [{ email: email }, { name: username }] });
            if (existingUser) {
                return {
                    status: "error",
                    message: "User already exists"
                };
            }
            const passwordHash = await hashPassword(password);

            const newUser = new User({
                name: username,
                email: email,
                password: passwordHash,
            });
            await newUser.save();
            return {
                status: "success",
                message: "User added successfully"
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
            const existingUser = await User.findOne({ $or: [{ email: useraccount }, { name: useraccount }] });
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
            await User.updateOne({ _id: existingUser._id }, { refreshToken: refreshToken });
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
            const { id, email, name } = googleProfile;
            console.log(id, email, name);

            if (!email) {
                throw new Error('Email is required');
            }
            console.log("before find user");
            // Kiểm tra xem user đã tồn tại chưa bằng email
            let user = await User.findOne({ email: email });
            console.log("after find user");
            console.log(user);
            if (!user) {
                // Nếu chưa tồn tại, tạo mới user
                user = new User({
                    googleId: id,
                    email: email,
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
            const user = await User.findOne({ refreshToken: refreshToken });
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

module.exports = UserService;