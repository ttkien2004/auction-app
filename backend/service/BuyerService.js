// services/BuyerService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTransactionsByBuyer = async (buyerId) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.findMany({ where: { buyer_id: buyerId } }))
	return [];
};

const getBidsByBuyer = async (buyerId) => {
	// TODO: Viết logic (ví dụ: prisma.bid.findMany({ where: { bidder_id: buyerId } }))
	return [];
};

const getReviewsByBuyer = async (buyerId) => {
	// TODO: Viết logic (ví dụ: prisma.review.findMany({ where: { reviewer_id: buyerId } }))
	return [];
};

module.exports = {
	getTransactionsByBuyer,
	getBidsByBuyer,
	getReviewsByBuyer,
};
