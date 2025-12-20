// routes/CartRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const CartController = require("../controller/CartController");

const routes = express.Router();

// Xem giỏ hàng: GET /api/cart
routes.get("/cart", authenticateToken, CartController.getCartController);
// Thêm vào giỏ: POST /api/cart
routes.post("/cart", authenticateToken, CartController.addToCartController);

// Xóa khỏi giỏ: DELETE /api/cart/:productId
routes.delete(
	"/cart/:productId",
	authenticateToken,
	CartController.removeFromCartController
);

module.exports = routes;
