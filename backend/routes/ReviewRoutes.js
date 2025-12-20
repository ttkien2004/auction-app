const express = require("express");
const reviewController = require("../controller/ReviewController");
const { authenticateToken } = require("../middleware/authMiddleware");

const routes = express.Router();

routes.get("/reviews/:transactionId", reviewController.getAllReviewsController);
// routes.get("/reviews/{id}", reviewController.getReviewByIdController);

routes.post(
	"/reviews",
	authenticateToken,
	reviewController.createReviewController
);

// GET: Lấy đánh giá của một Seller (Public)
routes.get(
	"/reviews/seller/:sellerId",
	reviewController.getReviewsBySellerController
);

routes.put(
	"/reviews",
	authenticateToken,
	reviewController.updateReviewController
);
routes.delete(
	"/reviews",
	authenticateToken,
	reviewController.deleteReviewController
);

module.exports = routes;
