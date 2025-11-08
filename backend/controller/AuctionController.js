// controllers/AuctionController.js
const AuctionService = require("../services/AuctionService");

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
		const { id } = req.params;
		const auction = await AuctionService.getAuctionById(Number(id));
		res.status(200).json(auction);
	} catch (error) {
		next(error);
	}
};

const createAuctionController = async (req, res, next) => {
	try {
		const { id } = req.params; // product ID
		const auctionData = req.body;
		const newAuction = await AuctionService.createAuction(
			Number(id),
			auctionData
		);
		res.status(201).json(newAuction);
	} catch (error) {
		next(error);
	}
};

const updateAuctionController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedAuction = await AuctionService.updateAuction(
			Number(id),
			updateData
		);
		res.status(200).json(updatedAuction);
	} catch (error) {
		next(error);
	}
};

const deleteAuctionController = async (req, res, next) => {
	try {
		const { id } = req.params;
		await AuctionService.deleteAuction(Number(id));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

const joinAuctionController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const userId = req.user.id; // Lấy từ auth middleware
		const result = await AuctionService.joinAuction(Number(id), userId);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

const getBidsForAuctionController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const bids = await AuctionService.getBidsForAuction(Number(id));
		res.status(200).json(bids);
	} catch (error) {
		next(error);
	}
};

const placeBidController = async (req, res, next) => {
	try {
		const { id } = req.params; // auction ID
		const userId = req.user.id; // Lấy từ auth middleware
		const bidData = req.body; // { bid_amount }
		const newBid = await AuctionService.placeBid(Number(id), userId, bidData);
		res.status(201).json(newBid);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllAuctionsController,
	getAuctionByIdController,
	createAuctionController,
	updateAuctionController,
	deleteAuctionController,
	joinAuctionController,
	getBidsForAuctionController,
	placeBidController,
};
