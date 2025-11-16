// services/BuyerService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTransactionsByBuyer = async (buyerId) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.findMany({ where: { buyer_id: buyerId } }))
	return await prisma.transaction.findMany({
		where: {
			buyer_ID: buyerId,
		},
		select: {
			Product: {
				select: {
					ID: true,
					name: true,
					type: true,
					Seller: {
						select: {
							User: {
								select: {
									name: true,
									phone_number: true,
								},
							},
						},
					},
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
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
