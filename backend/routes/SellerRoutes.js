const express = require("express");
const sellerService = require("../service/SellerService");
const { authenticateToken } = require("../middleware/authMiddleware");

const routes = express.Router();

routes.post(
	"/seller/{id}/products",
	authenticateToken,
	sellerService.createProductForSellerController
);
routes.get(
	"/seller/{id}/products",
	authenticateToken,
	sellerService.getProductsBySellerController
);
routes.get(
	"/seller/{id}/reviews",
	authenticateToken,
	sellerService.getReviewsForSellerController
);

module.exports = routes;
