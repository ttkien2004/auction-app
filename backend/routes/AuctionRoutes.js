const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const auctionController = require("../controller/AuctionController");

const routes = express.Router();

routes.get("/auctions", auctionController.getAllAuctionsController);
routes.get("/auctions/{id}", auctionController.getAuctionByIdController);
routes.get(
	"/auctions/{id}/bids",
	auctionController.getBidsForAuctionController
);

routes.post(
	"/auctions/{id}",
	authenticateToken,
	auctionController.createAuctionController
);
routes.put(
	"/auctions/{id}",
	authenticateToken,
	auctionController.updateAuctionController
);
routes.delete(
	"/auctions/{id}",
	authenticateToken,
	auctionController.deleteAuctionController
);
routes.post(
	"/auctions/{id}/join",
	authenticateToken,
	auctionController.joinAuctionController
);
routes.post(
	"/auctions/{id}/bids",
	authenticateToken,
	auctionController.placeBidController
);

module.exports = routes;
