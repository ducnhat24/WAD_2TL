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
      console.log(response.data[0]);
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
            console.log(req.user);
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

    
}

module.exports = new CustomerController();
