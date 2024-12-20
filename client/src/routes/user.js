const express = require("express");
const router = express.Router();
const CartController = require("../components/cart/controllers/cart_controller");
const OrderController = require("../components/order/controllers/order_controller");
const ProfileController = require("../components/profile/controllers/profile_controller");
router.get("/cart", CartController.showUserCard);
router.get("/order", OrderController.showUserOrder);
router.get("/profile", ProfileController.showUserProfile);
module.exports = router;
