class ProfileController {
  async showUserProfile(req, res) {
    res.render("profile");
  }
}

module.exports = new ProfileController();
