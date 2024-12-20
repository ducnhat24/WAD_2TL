const express = require('express');
const router = express.Router();
const HomeController = require('../components/home/controllers/home_controller');
const AboutUsController = require('../components/about_us/controllers/about_us_controller');
const ContactController = require('../components/contact/controllers/contact_controller');
const LoginController = require('../components/login/controllers/login_controller');
const SignupController = require('../components/signup/controllers/signup_controller');

router.get('/', HomeController.showHome);
router.get('/about_us', AboutUsController.showAboutUs);
router.get('/contact', ContactController.showContact);
router.get('/login', LoginController.showLogin);
router.get('/signup', SignupController.showSignup);

module.exports = router;