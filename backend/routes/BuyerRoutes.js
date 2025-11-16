const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const buyerController = require("../controller/BuyerController");

const routes = express.Router();

routes.get(
	"/buyer/transactions",
	authenticateToken,
	buyerController.getTransactionsByBuyerController
);
routes.get(
	"/buyer/{id}/bids",
	authenticateToken,
	buyerController.getBidsByBuyerController
);
routes.get(
	"/buyer/{id}/reviews",
	authenticateToken,
	buyerController.getReviewsByBuyerController
);

module.exports = routes;
