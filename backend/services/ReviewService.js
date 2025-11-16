// services/ReviewService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllReviews = async (transactionId) => {
	// TODO: Viết logic (ví dụ: prisma.review.findMany())
	if (isNaN(transactionId)) {
		throw new Error("Invalid id");
	}
	const reviews = await prisma.review.findMany({
		where: {
			transaction_ID: transactionId,
		},
		select: {
			rating: true,
			comment: true,
			created_at: true,
			Buyer: {
				select: {
					User: {
						select: {
							username: true,
						},
					},
				},
			},
		},
	});
	return reviews;
};

const getReviewById = async (reviewId) => {
	// TODO: Viết logic (ví dụ: prisma.review.findUnique({ where: ... }))
	const review = await prisma.review.findUnique({
		where: {
			ID: reviewId,
		},
	});
	return { id: reviewId };
};

const createReview = async (transactionId, reviewData, userId) => {
	// TODO: Viết logic (ví dụ: tạo review cho transaction_id)
	const { rating, comment } = reviewData;
	if (isNaN(transactionId)) {
		throw new Error("Invalid id");
	}
	return await prisma.$transaction(async (tx) => {
		const transaction = await prisma.transaction.findUnique({
			where: {
				ID: transactionId,
			},
		});
		if (!transaction) {
			throw new Error("Not found transaction");
		}
		if (transaction.buyer_ID !== userId) {
			throw new Error("Forbidden to access this service");
		}
		if (transaction.status !== "completed") {
			throw new Error("Cannot review due to status");
		}
		const existedReview = await tx.review.findFirst({
			where: {
				transaction_ID: transactionId,
			},
		});
		if (existedReview) {
			throw new Error("You've already reviewed this trans");
		}
		const newReview = await prisma.review.create({
			data: {
				transaction_ID: transactionId,
				rating: parseInt(rating),
				comment: comment,
				buyer_ID: userId,
			},
		});
		return newReview;
	});
};

const updateReview = async (reviewId, updateData, userId) => {
	// TODO: Viết logic (ví dụ: prisma.review.update({ where: ..., data: ... }))
	const review = await prisma.review.findUnique({
		where: {
			ID: reviewId,
		},
	});
	if (!review) {
		throw new Error("Not found review");
	}
	if (review.buyer_ID !== userId) {
		throw new Error("Forbidden to access this service");
	}
	return await prisma.review.update({
		where: {
			ID: reviewId,
		},
		data: {
			rating: updateData.rating ? parseInt(updateData.rating) : undefined,
			comment: updateData.comment,
		},
	});
};

const deleteReview = async (reviewId, userId) => {
	// TODO: Viết logic (ví dụ: prisma.review.delete({ where: ... }))
	const review = await prisma.review.findUnique({
		where: {
			ID: reviewId,
		},
	});
	if (!review) {
		throw new Error("Not found review");
	}

	// Kiểm tra quyền: Admin HOẶC người viết được xóa
	if (review.buyer_ID === userId) {
		await prisma.review.delete({
			where: { ID: reviewId },
		});
		return { message: "Delete successfully" };
	}
	throw new Error("Forbidden to access this service");
};

module.exports = {
	getAllReviews,
	getReviewById,
	createReview,
	updateReview,
	deleteReview,
};
