// services/AuctionService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllAuctions = async () => {
	// TODO: Viết logic (ví dụ: prisma.auction.findMany())
	return [];
};

const getAuctionById = async (auctionId) => {
	// TODO: Viết logic (ví dụ: prisma.auction.findUnique({ where: ... }))
	return { id: auctionId };
};

const createAuction = async (id, auctionData) => {
	// TODO: Viết logic (ví dụ: tạo auction cho 1 product_id)
	return { ...auctionData };
};

const updateAuction = async (auctionId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.auction.update({ where: ..., data: ... }))
	return { id: auctionId, ...updateData };
};

const deleteAuction = async (auctionId) => {
	// TODO: Viết logic (ví dụ: prisma.auction.delete({ where: ... }))
	return { message: "Xóa thành công" };
};

const joinAuction = async (auctionId, userId) => {
	// TODO: Viết logic (ví dụ: tạo watchlist)
	return { message: "Tham gia thành công" };
};

const getBidsForAuction = async (auctionId) => {
	// TODO: Viết logic (ví dụ: prisma.bid.findMany({ where: { auction_product_id: auctionId } }))
	return [];
};

const placeBid = async (auctionId, userId, bidData) => {
	// TODO: 1. Kiểm tra auction có hợp lệ
	// TODO: 2. Kiểm tra bid_amount có hợp lệ
	// TODO: 3. Tạo bid (ví dụ: prisma.bid.create({ data: ... }))
	return { ...bidData };
};

module.exports = {
	getAllAuctions,
	getAuctionById,
	createAuction,
	updateAuction,
	deleteAuction,
	joinAuction,
	getBidsForAuction,
	placeBid,
};
