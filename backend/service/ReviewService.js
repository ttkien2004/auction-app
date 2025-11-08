// services/ReviewService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllReviews = async () => {
	// TODO: Viết logic (ví dụ: prisma.review.findMany())
	return [];
};

const getReviewById = async (reviewId) => {
	// TODO: Viết logic (ví dụ: prisma.review.findUnique({ where: ... }))
	return { id: reviewId };
};

const createReview = async (id, reviewData) => {
	// TODO: Viết logic (ví dụ: tạo review cho transaction_id)
	return { ...reviewData };
};

const updateReview = async (reviewId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.review.update({ where: ..., data: ... }))
	return { id: reviewId, ...updateData };
};

const deleteReview = async (reviewId) => {
	// TODO: Viết logic (ví dụ: prisma.review.delete({ where: ... }))
	return { message: "Xóa thành công" };
};

module.exports = {
	getAllReviews,
	getReviewById,
	createReview,
	updateReview,
	deleteReview,
};
