const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../middleware/JWTAction.js");

const Customer = require("../schema/Customer.js");
const bcrypt = require("bcrypt");
const emailTransporter = require("../../../middleware/EmailTransporter.js")
const cloudinary = require("../../../middleware/Cloudinary.js");



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
      console.log("User:", user);
      const existingUser = await Customer.findOne({
        $or: [{ customerEmail: email }, { customerName: username }],
      });
      if (existingUser) {
        return {
          status: "error",
          message: "Customer already exists",
        };
      }
      const passwordHash = await hashPassword(password);

      const newUser = new Customer({
        customerName: username,
        customerEmail: email,
        customerPassword: passwordHash,
      });
      await newUser.save();
      return {
        status: "success",
        message: "Customer added successfully",
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error adding user",
      };
    }
  }

  async login({ useraccount, password }) {
    try {
      const existingUser = await Customer.findOne({
        $or: [{ customerEmail: useraccount }, { customerName: useraccount }],
      });
      console.log("Existing user:", existingUser);
      if (!existingUser) {
        return {
          status: "error",
          msg: "Invalid credentials",
        };
      }
      const checkPassword = await bcrypt.compare(
        password,
        existingUser.customerPassword
      );
      if (checkPassword === false) {
        return {
          status: "error",
          msg: "Wrong password",
        };
      }
      const payload = {
        userID: existingUser._id,
        userRole: "Customer",
      };
      const refreshToken = generateRefreshToken(payload);
      await Customer.updateOne(
        { _id: existingUser._id },
        { refreshToken: refreshToken }
      );
      return {
        status: "success",
        accessToken: generateAccessToken(payload),
        refreshToken: refreshToken,
        msg: "Login successful",
        user: existingUser,
      };
    } catch (error) {
      return {
        status: "error",
        msg: error.message,
      };
    }
  }

  async loginWithGoogle(googleProfile) {
    try {
      const { id, customerEmail, name } = googleProfile;
      if (!customerEmail) {
        throw new Error("Email is required");
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
          user.name = name; // You can also update the name if necessary
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
          message: "Invalid refresh token",
        };
      }

      user.refreshToken = "";
      await user.save();
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await Customer.find();
      if (!users) {
        return {
          status: "error",
          message: "No users found",
        };
      }
      return {
        status: "success",
        message: "Users found",
        data: users,
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }
  async getUserById(id) {
    try {
      const user = await Customer.find({ _id: id });
      if (!user) {
        return {
          status: "error",
          message: "User not found",
        };
      }
      return {
        status: "success",
        message: "User found",
        data: user,
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async updateStatusAccountUser(id) {
    try {
      const user = await Customer.findById(id);
      if (!user) {
        return {
          status: "error",
          message: "User not found",
        };
      }
      if (user.customerAccountStatus === "ACTIVE") {
        user.customerAccountStatus = "INACTIVE";
      } else {
        user.customerAccountStatus = "ACTIVE";
      }
      await user.save();
      return {
        status: "success",
        message: "User status updated",
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async filterUser(query) {
    try {
      const { sortBy, sortType, keySearch } = query;
      const querySearch = keySearch
        ? {
            $or: [
              { customerName: { $regex: keySearch, $options: "i" } },
              { customerEmail: { $regex: keySearch, $options: "i" } },
            ],
          }
        : {};
      const customers = await Customer.find(querySearch);

      if (!customers) {
        return {
          status: "error",
          message: "No users found",
        };
      }

      let users = customers;
      if (sortBy) {
        users = [...customers].sort((a, b) => {
          if (sortType === "asc") {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] < b[sortBy] ? 1 : -1;
          }
        });
      }

            return {
                status: "success",
                message: "Users found",
                data: users,
            };
        } catch (error) {
            return {
                status: "error",
                message: error.message,
            };
        }
    }

    async getCustomerID(user) {
        try {
            const customer = await Customer.findOne({ _id: user.id });
            if (!customer) {
                return {
                    status: "error",
                    message: "User not found",
                };
            }
            return {
                status: "success",
                message: "User found",
                data: customer,
            };
        }
        catch (error) {
            return {
                status: "error",
                message: error.message,
            };
        }
  }
  
  async getUserByID(id) {
    try {
      const user = await Customer.find({ _id: id });

      if (!user) {
        return {
          status: "error",
          message: "User not found",
        };
      }
      return {
        status: "success",
        message: "User found",
        data: user,
      };
    }
    catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  } 

  // async uploadAvatar(file) {
  //   console.log("file", file);
  //   const result = await cloudinary.uploader.upload(file.path, {
  //     folder: "avatars",
  //   });
  //   return result.secure_url;
  // }

  // async updateCustomer (customerId, updateData) {
  //   return await Customer.findByIdAndUpdate(customerId, updateData, { new: true });
  // };

  async updateEmail(customerId, newEmail) {
    try {
      console.log(customerId, newEmail);
      // Kiểm tra nếu email mới đã tồn tại trong cơ sở dữ liệu
      const existingCustomer = await Customer.findOne({ customerEmail: newEmail });
      if (existingCustomer) {
        throw new Error('Email already exists');
      }

      // Cập nhật email cho khách hàng
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { customerEmail: newEmail },
        { new: true }
      );

      if (!updatedCustomer) {
        throw new Error('Customer not found');
      }

      return updatedCustomer; // Trả về khách hàng đã cập nhật
    } catch (error) {
      throw new Error(error.message); // Ném lỗi nếu có vấn đề xảy ra
    }
  }

  // async updateAvatar(customerId, newAvatarUrl) {
  //   try {
  //     // Cập nhật avatar mới cho khách hàng
  //     console.log("avatar", customerId, newAvatarUrl);
  //     const updatedCustomer = await Customer.findByIdAndUpdate(
  //       customerId,
  //       { customerAvatar: newAvatarUrl },
  //       { new: true }
  //     );

  //     if (!updatedCustomer) {
  //       throw new Error('Customer not found');
  //     }

  //     return updatedCustomer; // Trả về khách hàng đã cập nhật
  //   } catch (error) {
  //     throw new Error(error.message); // Ném lỗi nếu có vấn đề xảy ra
  //   }
  // }


  async updateName(customerId, newName) {
    try {
      // Cập nhật tên mới cho khách hàng
      console.log(customerId, newName);
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { customerName: newName.customerName },
        { new: true }
      );

      if (!updatedCustomer) {
        throw new Error('Customer not found');
      }

      return updatedCustomer; // Trả về khách hàng đã cập nhật
    } catch (error) {
      throw new Error(error.message); // Ném lỗi nếu có vấn đề xảy ra
    }
  }



  async generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };


  async sendOtpEmail(to, otp) {
    if (!to || !otp) {
      console.error("Missing email or OTP");
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Your Verification Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    try {
      console.log("Sending OTP:", otp, "to:", to);
      const result = await emailTransporter.sendMail(mailOptions);
      console.log('Email sent:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async uploadAvatar(filePath) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "avatars",
      });
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload avatar");
    }
  }

  async updateAvatar(customerId, newAvatarUrl) {
    try {
      console.log("avatar", customerId, newAvatarUrl);
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { customerAvatar: newAvatarUrl },
        { new: true }
      );

      if (!updatedCustomer) {
        throw new Error("Customer not found");
      }

      return updatedCustomer;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CustomerService();
