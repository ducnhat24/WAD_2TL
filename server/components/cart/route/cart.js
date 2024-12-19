const express = require("express");
const cartRoute = express.Router();
const CartController = require("../controller/CartController");

// Thêm sản phẩm vào giỏ hàng
cartRoute.post("/", CartController.addProductToCart);
// Xóa sản phẩm khỏi giỏ hàng
cartRoute.delete("/", CartController.removeProductFromCart);
// Cập nhật số lượng sản phẩm trong giỏ hàng
cartRoute.put("/", CartController.updateProductInCart);
// Lấy danh sách sản phẩm trong giỏ hàng
cartRoute.get("/", CartController.getCart);

module.exports = cartRoute;
