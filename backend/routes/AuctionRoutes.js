const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const auctionController = require("../controller/AuctionController");

const routes = express.Router();

routes.get("/auctions", auctionController.getAuctionsController);
// routes.get("/auctions/{id}", auctionController.getAuctionByIdController);

routes.post(
	"/auctions",
	authenticateToken,
	auctionController.createAuctionController
);
routes.put(
	"/auctions",
	authenticateToken,
	auctionController.updateAuctionController
);
routes.delete(
	"/auctions",
	authenticateToken,
	auctionController.deleteAuctionController
);
routes.post(
	"/auctions/join",
	authenticateToken,
	auctionController.joinAuctionController
);

// Lượt đấu giá
routes.get("/auctions/bids", auctionController.getBidsForAuctionController);

routes.post(
	"/auctions/bids",
	authenticateToken,
	auctionController.placeBidController
);

module.exports = routes;
