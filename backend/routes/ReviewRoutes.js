const express = require("express");
const reviewController = require("../controller/ReviewController");
const { authenticateToken } = require("../middleware/authMiddleware");

const routes = express.Router();

routes.get("/reviews", reviewController.getAllReviewsController);
routes.get("/reviews/{id}", reviewController.getReviewByIdController);

routes.post(
	"/reviews/{id}",
	authenticateToken,
	reviewController.createReviewController
);
routes.put(
	"/reviews/{id}",
	authenticateToken,
	reviewController.updateReviewController
);
routes.delete(
	"/reviews/{id}",
	authenticateToken,
	reviewController.deleteReviewController
);

module.exports = routes;
