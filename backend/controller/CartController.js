// controller/CartController.js
const CartService = require("../services/CartService");

const addToCartController = async (req, res, next) => {
	try {
		const userId = req.user.id; // Lấy từ authMiddleware
		const { productId } = req.body;
		console.log(productId);

		if (!productId) {
			return res.status(400).json({ message: "Thiếu productId" });
		}

		const cartItem = await CartService.addToCart(userId, parseInt(productId));

		res.status(201).json({
			message: "Đã thêm vào giỏ hàng",
			data: cartItem,
		});
	} catch (error) {
		next(error);
	}
};

const getCartController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const cartItems = await CartService.getCart(userId);
		res.status(200).json(cartItems);
	} catch (error) {
		next(error);
	}
};

const removeFromCartController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { productId } = req.params; // Lấy từ URL: /cart/:productId

		await CartService.removeFromCart(userId, parseInt(productId));
		res.status(200).json({ message: "Đã xóa khỏi giỏ hàng" });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	addToCartController,
	getCartController,
	removeFromCartController,
};
