class OrderController {
  async showUserOrder(req, res) {
    res.render("order");
  }
}

module.exports = new OrderController();
