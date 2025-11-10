// services/SellerService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProductForSeller = async (sellerId, productData) => {
	// TODO: Viết logic (ví dụ: prisma.product.create({ data: { ...productData, seller_id: sellerId } }))
	return { ...productData, seller_id: sellerId };
};

const getProductsBySeller = async (sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.product.findMany({ where: { seller_id: sellerId } }))
	return [];
};

const getReviewsForSeller = async (sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.review.findMany({ where: { reviewed_user_id: sellerId } }))
	return [];
};

module.exports = {
	createProductForSeller,
	getProductsBySeller,
	getReviewsForSeller,
};
