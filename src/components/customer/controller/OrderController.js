
class OrderController {
    showOrder(req, res) {
        res.render('order');
    }
}

module.exports = new OrderController;