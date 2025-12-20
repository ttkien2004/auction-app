const express = require("express");
const SellerController = require("../controller/SellerController");
const { authenticateToken } = require("../middleware/authMiddleware");

const routes = express.Router();

routes.post(
	"/seller/products",
	authenticateToken,
	SellerController.createProductForSellerController
);
routes.get(
	"/seller/products",
	authenticateToken,
	SellerController.getProductsBySellerController
);
routes.get(
	"/seller/{id}/reviews",
	authenticateToken,
	SellerController.getReviewsForSellerController
);

routes.get(
	"/seller/transactions",
	authenticateToken,
	SellerController.getTransactionsForSellerController
);

routes.patch(
	"/seller/products/:id",
	authenticateToken,
	SellerController.updateProductForSellerController
);

routes.delete(
	"/seller/products/:id",
	authenticateToken,
	SellerController.deleteProductForSellerController
);

module.exports = routes;
