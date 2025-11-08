// controllers/SellerController.js
const SellerService = require("../services/SellerService");

const createProductForSellerController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const productData = req.body;
		const newProduct = await SellerService.createProductForSeller(
			Number(id),
			productData
		);
		res.status(201).json(newProduct);
	} catch (error) {
		next(error);
	}
};

const getProductsBySellerController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const products = await SellerService.getProductsBySeller(Number(id));
		res.status(200).json(products);
	} catch (error) {
		next(error);
	}
};

const getReviewsForSellerController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const reviews = await SellerService.getReviewsForSeller(Number(id));
		res.status(200).json(reviews);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createProductForSellerController,
	getProductsBySellerController,
	getReviewsForSellerController,
};
