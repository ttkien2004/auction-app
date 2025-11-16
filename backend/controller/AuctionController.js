// controllers/AuctionController.js
const AuctionService = require("../services/AuctionService");

const getAuctionsController = async (req, res, next) => {
	try {
		const auctions = await AuctionService.getAuctions(req.query);
		res.status(200).json(auctions);
	} catch (error) {
		next(error);
	}
};

const getAllAuctionsController = async (req, res, next) => {
	try {
		const auctions = await AuctionService.getAllAuctions();
		res.status(200).json(auctions);
	} catch (error) {
		next(error);
	}
};

const getAuctionByIdController = async (req, res, next) => {
	try {
		const { id } = req.query;
		const auction = await AuctionService.getAuctionById(Number(id));
		res.status(200).json(auction);
	} catch (error) {
		next(error);
	}
};

const createAuctionController = async (req, res, next) => {
	try {
		const { productId } = req.query; // product ID
		const auctionData = req.body;
		const newAuction = await AuctionService.createAuction(
			Number(productId),
			auctionData
		);
		res.status(201).json(newAuction);
	} catch (error) {
		next(error);
	}
};

const updateAuctionController = async (req, res, next) => {
	try {
		const { auctionId } = req.query;
		const updateData = req.body;
		const updatedAuction = await AuctionService.updateAuction(
			Number(auctionId),
			updateData
		);
		res.status(200).json(updatedAuction);
	} catch (error) {
		next(error);
	}
};

const deleteAuctionController = async (req, res, next) => {
	try {
		const { auctionId } = req.query;
		await AuctionService.deleteAuction(Number(auctionId));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

const joinAuctionController = async (req, res, next) => {
	try {
		const { auctionId } = req.query;
		const userId = req.user.id; // Lấy từ auth middleware
		const result = await AuctionService.joinAuction(Number(auctionId), userId);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

const getBidsForAuctionController = async (req, res, next) => {
	try {
		const { auctionId } = req.query;
		const bids = await AuctionService.getBidsForAuction(Number(auctionId));
		res.status(200).json(bids);
	} catch (error) {
		next(error);
	}
};

const placeBidController = async (req, res, next) => {
	try {
		const { auctionId } = req.query; // auction ID
		const userId = req.user.id; // Lấy từ auth middleware
		const bidData = req.body; // { bid_amount }
		const newBid = await AuctionService.placeBid(
			Number(auctionId),
			userId,
			bidData
		);
		res.status(201).json(newBid);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAuctionsController,
	getAllAuctionsController,
	getAuctionByIdController,
	createAuctionController,
	updateAuctionController,
	deleteAuctionController,
	joinAuctionController,
	getBidsForAuctionController,
	placeBidController,
};
