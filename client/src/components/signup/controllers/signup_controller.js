class SignupController {
  showSignup(req, res) {
    res.render("signup");
  }
}

module.exports = new SignupController();
