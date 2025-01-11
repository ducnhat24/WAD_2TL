const CustomerService = require("../model/CustomerService");

class CustomerController {
  // showProfile(req, res) {
  //   // get user info from req.user
  //   // render profile page with user info

  //   const userID = req.user.id;

  //   // call service to get user info
  //   const user = CustomerService.getUserByID(userID);
  //   res.render("profile", {profile: user});
  // }

  async showProfile(req, res) {
    try {
      // Lấy userID từ req.user
      const userID = req.user.id;

      // Gọi service để lấy thông tin user
      const response = await CustomerService.getUserByID(userID);
      // Kiểm tra kết quả
      if (response.status === "error") {
        return res.status(404).send(response.message);
      }
      // Render profile page với dữ liệu người dùng
      res.render("profile", { profile: response.data[0] });
    } catch (error) {
      // Xử lý lỗi và trả về thông báo lỗi
      res.status(500).send("Internal Server Error");
    }
  }


  showSignup(req, res) {
    res.render("signup");
  }

  showLogin(req, res) {
    res.render("login");
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
    res.cookie("accessToken", user.accessToken, options);
    res.cookie("refreshToken", user.refreshToken, options);
    res.json(user);
  }

  async logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    const user = await CustomerService.logout(refreshToken);

    return res.json({
      status: "success",
      msg: "Logged out",
    });
  }

  async auth(req, res) {
    return res.json({
      status: "success",
      user: req.user,
      msg: "Authenticated",
    });
  }

  async getAllUsers(req, res) {
    try {
      const status = await CustomerService.getAllUsers();
      if (status.status === "success") {
        return res.status(200).json(status);
      }

      return res.status(400).json(status);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Internal server error",
      });
    }
  }
  async getUserById(req, res) {
    try {
      const profile = await CustomerService.getUserById(id);
      res.render("profile", { profile: profile });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Internal server error",
      });
    }
  }

  async updateStatusAccountUser(req, res) {
    try {
      const { id } = req.params;
      const status = await CustomerService.updateStatusAccountUser(id);
      if (status.status === "success") {
        return res.status(200).json(status);
      }

      return res.status(400).json(status);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Internal server error",
      });
    }
  }

  async filterUser(req, res) {
    try {
      // const { sortBy, sortType } = req.query;
      const status = await CustomerService.filterUser(req.query);
      if (status.status === "success") {
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

  async getCustomerID(req, res) {
        try {
            const customerID = await CustomerService.getCustomerID(req.user);
            if (customerID.status === 'success') {
                return res.status(200).json(customerID);
            }

            return res.status(400).json(customerID);
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                msg: 'Internal server error'
            });
        }
  }

  async updateAvatar(req, res) {
    try {
      // Upload avatar lên máy chủ thứ ba (ví dụ Cloudinary)
      const uploadedAvatarUrl = await CustomerService.uploadAvatar(req.file);

      // Cập nhật avatar trong MongoDB
      const updatedCustomer = await CustomerService.updateAvatar(req.user.id, {
        customerAvatar: uploadedAvatarUrl,
      });

      res.status(200).json({ message: "Avatar updated successfully", updatedCustomer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async updateName(req, res) {
    try {
      const updatedCustomer = await CustomerService.updateName(req.body.customerID, {
        customerName: req.body.customerName,
      });
      res.status(200).json({ message: "Name updated successfully", updatedCustomer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async startEmailUpdate(req, res) {
    try {
      const otp = await CustomerService.generateOtp();
      await CustomerService.sendOtpEmail(req.body.email, otp);
      
      // Lưu OTP tạm thời vào phiên người dùng
      req.session.otp = otp;
      req.session.tempEmail = req.body.email;

      console.log(req.session);


      res.status(200).json({ message: "Verification email sent." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async verifyEmailUpdate(req, res) {
     try {
       const { otp } = req.body;
       console.log(req.session);
       // Kiểm tra OTP
      if (req.session.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
       }
      // Cập nhật email vào database
       const updatedCustomer = await CustomerService.updateEmail(
         req.body.customerID, 
         req.session.tempEmail,
      );

      // Xóa OTP và email tạm
      req.session.otp = null;
      req.session.tempEmail = null;

      res.status(200).json({ message: "Email updated successfully", updatedCustomer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
    
}

module.exports = new CustomerController();
