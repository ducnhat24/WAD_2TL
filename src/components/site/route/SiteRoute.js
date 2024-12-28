const express = require('express');
const siteRoute = express.Router();
const SiteController = require('../controller/SiteController');

siteRoute.get('/', SiteController.showHome);
siteRoute.get('/contact', SiteController.showContact);
siteRoute.get('/about_us', SiteController.showAboutUs);

module.exports = siteRoute;