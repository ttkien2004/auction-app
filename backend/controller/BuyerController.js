// controllers/BuyerController.js
const BuyerService = require("../services/BuyerService");

const getTransactionsByBuyerController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const transactions = await BuyerService.getTransactionsByBuyer(Number(id));
		res.status(200).json(transactions);
	} catch (error) {
		next(error);
	}
};

const getBidsByBuyerController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const bids = await BuyerService.getBidsByBuyer(Number(id));
		res.status(200).json(bids);
	} catch (error) {
		next(error);
	}
};

const getReviewsByBuyerController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const reviews = await BuyerService.getReviewsByBuyer(Number(id));
		res.status(200).json(reviews);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getTransactionsByBuyerController,
	getBidsByBuyerController,
	getReviewsByBuyerController,
};
