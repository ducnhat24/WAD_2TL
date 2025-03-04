const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../middleware/JWTAction.js");

const Customer = require("../schema/Customer.js");
const bcrypt = require("bcrypt");
const emailTransporter = require("../../../middleware/EmailTransporter.js")
const cloudinary = require("../../../middleware/Cloudinary.js");
const { generateOtp, verifyOtpCode } = require('../../../helpers/otpHelper');
const crypto = require("crypto");
const moment = require('moment-timezone');
const querystring = require('qs');
const Order = require('../schema/Order');
const Product = require('../../product/schema/Product.js');  // Nếu cần validate thông tin sản phẩm
const mongoose = require('mongoose');



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

      if (existingUser.customerAccountStatus === "INACTIVE") {
        return {
          status: "error",
          msg: "Account is inactive",
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

      const payload = { userID: user._id, userRole: "Customer" };

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
      const user = await Customer.findOne({ _id: id });
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

  async getCustomerID(userID) {
    try {
      const customer = await Customer.findOne({ _id: userID });
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

  async findCustomerById(customerID) {
    return await Customer.findById(customerID);
  }

  async updatePassword(customerID, hashedPassword) {
    return await Customer.findByIdAndUpdate(customerID, { customerPassword: hashedPassword }, { new: true });
  }

  async getUserProfile(userId) {
    const user = await Customer.findById(userId, "customerName customerEmail customerAvatar customerPassword");

    if (!user) {
      return null;
    }

    return {
      customerName: user.customerName,
      customerEmail: user.customerEmail,
      customerAvatar: user.customerAvatar,
      hasPassword: !!user.customerPassword, // Trả về true nếu người dùng có mật khẩu
    };
  };

  async sendOtp(email) {
    const customer = await Customer.findOne({ customerEmail: email });
    if (!customer) throw new Error('Email not found');

    const otpId = await generateOtp(email);
    return { otpId };
  };

  async verifyOtp(otp) {
    return await verifyOtpCode(otp);
  };

  // async resetPassword(newPassword) {
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   await Customer.findOneAndUpdate({ customerEmail }, { customerPassword: hashedPassword });
  // };

  async resetPassword(customerEmail, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Customer.findOneAndUpdate({ customerEmail }, { customerPassword: hashedPassword });
  };

  async createPayment(clientIp, reqData) {

    const date = new Date();
    const orderId = moment.tz(date, 'Asia/Ho_Chi_Minh').format('DDHHmmss'); // Định dạng orderId
    const ipv4Address = clientIp.includes(':') ? '127.0.0.1' : clientIp;
    let createDate = moment.tz(date, 'Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
    let expiredDate = moment.tz(date, 'Asia/Ho_Chi_Minh').add(5, 'minutes').format('YYYYMMDDHHmmss');

    let amountNumber = reqData.amount.replace(/[^\d]/g, '');  // Loại bỏ mọi ký tự không phải số
    let amount = parseInt(amountNumber, 10);

    const vnpParams = {
      vnp_Version: '2.1.1',
      vnp_Command: 'pay',
      vnp_TmnCode: process.env.VNP_TMNCODE,
      vnp_Amount: amount * 100, // VNPay yêu cầu đơn vị là đồng
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: reqData.paymentDescription, // Mô tả đơn hàng
      vnp_Locale: reqData.language,
      vnp_OrderType: 'topup',
      vnp_ReturnUrl: process.env.VNP_RETURNURL,
      vnp_IpAddr: ipv4Address,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expiredDate,
    };
    if (reqData.paymentMethod !== null && reqData.paymentMethod !== '') {
      vnpParams['vnp_BankCode'] = reqData.paymentMethod;
    }

    // Sắp xếp tham số
    const sortedParams = sortObject(vnpParams);

    // Tạo chuỗi ký hiệu
    const signData = querystring.stringify(sortedParams, { encode: false });

    // Tạo chữ ký bảo mật
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams.vnp_SecureHash = signed;

    console.log("sent");
    console.log(sortedParams);

    let vnpUrl = process.env.VNP_URL;
    vnpUrl += '?' + querystring.stringify(sortedParams, { encode: false });
    // console.log(vnpUrl);

    return vnpUrl;
  };

  // async createOrder(orderData) {
  //   try {
  //     const {
  //       customerID,
  //       orderListProduct,
  //       orderShippingAddress,
  //       orderShippingMethod,
  //       orderShippingFee,
  //       orderTotalPrice,
  //       orderPayment,
  //       orderStatus,
  //     } = orderData;

  //     // Kiểm tra và chuyển đổi ObjectId cho customerID và orderShippingMethod
  //     if (!mongoose.Types.ObjectId.isValid(customerID)) {
  //       throw new Error("Invalid customerID.");
  //     }

  //     if (!mongoose.Types.ObjectId.isValid(orderShippingMethod)) {
  //       throw new Error("Invalid orderShippingMethod.");
  //     }

  //     // Kiểm tra sự tồn tại của sản phẩm trong orderListProduct
  //     const productIds = orderListProduct.map(item => item.productId);
  //     const products = await Product.find({ '_id': { $in: productIds } });

  //     if (products.length !== orderListProduct.length) {
  //       throw new Error("One or more products are invalid or not found.");
  //     }

  //     // Kiểm tra nếu số lượng sản phẩm là hợp lệ (có thể bạn sẽ cần kiểm tra thêm các quy tắc khác)
  //     const invalidProductQuantities = orderListProduct.filter(item => {
  //       const product = products.find(p => p._id.toString() === item.productId.toString());
  //       return product && item.quantity > product.stock;  // Kiểm tra số lượng vượt quá số lượng trong kho
  //     });

  //     if (invalidProductQuantities.length > 0) {
  //       throw new Error("Some products have insufficient stock.");
  //     }

  //     // Tạo đơn hàng mới
  //     const newOrder = new Order({
  //       customerID,
  //       orderListProduct,
  //       orderShippingAddress,
  //       orderShippingMethod,
  //       orderShippingFee,
  //       orderTotalPrice,
  //       orderPayment,
  //       orderStatus,
  //     });

  //     // Lưu đơn hàng vào MongoDB
  //     return await newOrder.save();
  //   } catch (error) {
  //     console.error("Error creating order:", error);
  //     throw error;  // Ném lỗi lên controller để xử lý
  //   }
  // }

  // async createOrder(orderData) {
  //     try {
  //         const {
  //             customerID,
  //             orderListProduct,
  //             orderShippingAddress,
  //             orderShippingMethod,
  //             orderShippingFee,
  //             orderTotalPrice,
  //             orderPayment,
  //             orderStatus,
  //         } = orderData;

  //         // Kiểm tra và chuyển đổi ObjectId cho customerID và orderShippingMethod
  //         if (!mongoose.Types.ObjectId.isValid(customerID)) {
  //             throw new Error("Invalid customerID.");
  //         }

  //         if (!mongoose.Types.ObjectId.isValid(orderShippingMethod)) {
  //             throw new Error("Invalid orderShippingMethod.");
  //         }

  //         // Kiểm tra sự tồn tại của sản phẩm trong orderListProduct
  //         const productIds = orderListProduct.map(item => item.productId);
  //         const products = await Product.find({ '_id': { $in: productIds } });

  //         if (products.length !== orderListProduct.length) {
  //             throw new Error("One or more products are invalid or not found.");
  //         }

  //         // Kiểm tra nếu số lượng sản phẩm là hợp lệ (có thể bạn sẽ cần kiểm tra thêm các quy tắc khác)
  //         const invalidProductQuantities = orderListProduct.filter(item => {
  //             const product = products.find(p => p._id.toString() === item.productId.toString());
  //             return product && item.quantity > product.stock;  // Kiểm tra số lượng vượt quá số lượng trong kho
  //         });

  //         if (invalidProductQuantities.length > 0) {
  //             throw new Error("Some products have insufficient stock.");
  //         }

  //         // Tạo đơn hàng mới
  //         const newOrder = new Order({
  //             customerID,
  //             orderListProduct,
  //             orderShippingAddress,
  //             orderShippingMethod,
  //             orderShippingFee,
  //             orderTotalPrice,
  //             orderPayment,
  //             orderStatus,
  //         });

  //         // Lưu đơn hàng vào MongoDB
  //         return await newOrder.save();
  //     } catch (error) {
  //         console.error("Error creating order:", error);
  //         throw error;  // Ném lỗi lên controller để xử lý
  //     }
  // }

  // async createOrderAfterPayment(orderData) {
  //       try {
  //           const {
  //               customerID,
  //               orderShippingAddress,
  //               orderShippingMethod,
  //               orderShippingFee,
  //               orderTotalPrice,
  //               selectedProducts,
  //               orderPayment,
  //               orderStatus,
  //           } = orderData;

  //           // Kiểm tra tính hợp lệ của customerID
  //           if (!mongoose.Types.ObjectId.isValid(customerID)) {
  //               throw new Error("Invalid customerID.");
  //           }

  //           // Kiểm tra sự tồn tại của các sản phẩm trong order
  //           const productIds = selectedProducts.map(item => item.productId);
  //           const products = await Product.find({ '_id': { $in: productIds } });

  //           if (products.length !== selectedProducts.length) {
  //               throw new Error("Some products are invalid or not found.");
  //           }

  //           // Kiểm tra số lượng sản phẩm (nếu cần)
  //           const invalidProductQuantities = selectedProducts.filter(item => {
  //               const product = products.find(p => p._id.toString() === item.productId.toString());
  //               return product && item.quantity > product.stock;
  //           });

  //           if (invalidProductQuantities.length > 0) {
  //               throw new Error("Some products have insufficient stock.");
  //           }

  //           // Tạo đơn hàng mới
  //           const newOrder = new Order({
  //               customerID,
  //               orderShippingAddress,
  //               orderShippingMethod,
  //               orderShippingFee,
  //               orderTotalPrice,
  //               selectedProducts,
  //               orderPayment,
  //               orderStatus,
  //           });

  //           // Lưu vào MongoDB
  //           return await newOrder.save();
  //       } catch (error) {
  //           console.error("Error creating order after payment:", error);
  //           throw error; // Ném lỗi lên controller để xử lý
  //       }
  //   }
  async createOrderAfterPayment(orderData) {
    try {
      const {
        customerID,
        orderShippingAddress,
        orderShippingMethod,
        orderShippingFee,
        orderTotalPrice,
        selectedProducts,
        orderPayment,
        orderStatus,
      } = orderData;
      console.log(orderData);

      // Kiểm tra tính hợp lệ của customerID
      if (!mongoose.Types.ObjectId.isValid(customerID)) {
        throw new Error("Invalid customerID.");
      }

      // Kiểm tra sự tồn tại của các sản phẩm trong order
      const productIds = selectedProducts.map(item => item.productId);
      const products = await Product.find({ '_id': { $in: productIds } });

      if (products.length !== selectedProducts.length) {
        throw new Error("Some products are invalid or not found.");
      }

      // Kiểm tra số lượng sản phẩm (nếu cần)
      const invalidProductQuantities = selectedProducts.filter(item => {
        const product = products.find(p => p._id.toString() === item.productId.toString());
        return product && item.quantity > product.stock;
      });

            if (invalidProductQuantities.length > 0) {
                throw new Error("Some products have insufficient stock.");
          }
          
          let orderListProduct = [];
          for (let i = 0; i < selectedProducts.length; i++) {
              const product = products.find(p => p._id.toString() === selectedProducts[i].productId.toString());
              if (product) {
                  orderListProduct.push({
                      productId: product._id,         // Đảm bảo sử dụng product._id thay vì product.productId
                      quantity: selectedProducts[i].quantity,
                      productPrice: product.productPrice,   // Đảm bảo sử dụng product.productPrice thay vì product.price
                  });
              } else {
                  console.error(`Product not found for id: ${selectedProducts[i].productId}`);
              }
          }



            // Tạo đơn hàng mới
            const newOrder = new Order({
                customerID,
                orderShippingAddress,
                orderShippingMethod,
                orderShippingFee,
                orderTotalPrice,
                orderListProduct,
                orderPayment,
                orderStatus,
            });
            console.log(newOrder);
            // Lưu vào MongoDB
            return await newOrder.save();
        } catch (error) {
            console.error("Error creating order after payment:", error);
            throw error; // Ném lỗi lên controller để xử lý
        }
  }
  
  async sendOtpSignup(email) {
    const customer = await Customer.findOne({ customerEmail: email });
    if (customer) throw new Error('This email has been used');

    const otpId = await generateOtp(email);
    return { otpId };
  };

  async verifyOtpSignup(otp, username, customerEmail, customerPassword) {
    // const isawait verifyOtpCode(otp);
    const isCorrectOTP = await verifyOtpCode(otp);
    if (!isCorrectOTP) throw new Error('Invalid OTP');

    const hashedPassword = await hashPassword(customerPassword);

    // create new customer
    const newCustomer = new Customer({
      customerName: username,
      customerEmail: customerEmail,
      customerPassword: hashedPassword,
    });

    await newCustomer.save();


    return newCustomer;
  };
}

module.exports = new CustomerService();


function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;

  // Lấy tất cả các khóa của đối tượng
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(key); // Lưu trữ khóa chưa mã hóa
    }
  }

  // Sắp xếp các khóa
  str.sort();

  // Tạo đối tượng đã sắp xếp với giá trị đã mã hóa
  for (key = 0; key < str.length; key++) {
    // Mã hóa giá trị của tham số, thay %20 bằng dấu cộng
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }

  return sorted;
}