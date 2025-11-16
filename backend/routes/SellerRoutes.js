const express = require("express");
const SellerController = require("../controller/SellerController");
const { authenticateToken } = require("../middleware/authMiddleware");

const routes = express.Router();

routes.post(
	"/seller/{id}/products",
	authenticateToken,
	SellerController.createProductForSellerController
);
routes.get(
	"/seller/{id}/products",
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

module.exports = routes;
