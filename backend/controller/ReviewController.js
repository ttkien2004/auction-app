// controllers/ReviewController.js
const ReviewService = require("../services/ReviewService");

const getAllReviewsController = async (req, res, next) => {
	try {
		const reviews = await ReviewService.getAllReviews();
		res.status(200).json(reviews);
	} catch (error) {
		next(error);
	}
};

const getReviewByIdController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const review = await ReviewService.getReviewById(Number(id));
		res.status(200).json(review);
	} catch (error) {
		next(error);
	}
};

const createReviewController = async (req, res, next) => {
	try {
		const { id } = req.params; // Thường là transactionId
		const reviewData = req.body;
		const userId = req.user.id; // Lấy từ auth middleware
		const newReview = await ReviewService.createReview(
			Number(id),
			userId,
			reviewData
		);
		res.status(201).json(newReview);
	} catch (error) {
		next(error);
	}
};

const updateReviewController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedReview = await ReviewService.updateReview(
			Number(id),
			updateData
		);
		res.status(200).json(updatedReview);
	} catch (error) {
		next(error);
	}
};

const deleteReviewController = async (req, res, next) => {
	try {
		const { id } = req.params;
		await ReviewService.deleteReview(Number(id));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllReviewsController,
	getReviewByIdController,
	createReviewController,
	updateReviewController,
	deleteReviewController,
};
