
class SiteController {
    showAboutUs(req, res) {
        res.render('about_us');
    }

    showContact(req, res) {
        res.render('contact');
    }

    showHome(req, res) {
        res.render('home');
    }


}

module.exports = new SiteController;