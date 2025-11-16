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

const getTransactions = async (sellerId) => {
	return await prisma.transaction.findMany({
		where: {
			Product: {
				seller_ID: sellerId,
			},
		},
		include: {
			Product: {
				select: { ID: true, name: true, type: true },
			},
			// Lấy thông tin người mua (để Seller biết giao hàng cho ai)
			Buyer: {
				select: {
					User: {
						select: { name: true, address: true, phone_number: true },
					},
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

module.exports = {
	createProductForSeller,
	getProductsBySeller,
	getReviewsForSeller,
	getTransactions,
};
