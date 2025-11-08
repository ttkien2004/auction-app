// services/UserService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async () => {
	// TODO: Viết logic (ví dụ: prisma.user.findMany())
	return [];
};

const getUserById = async (userId) => {
	// TODO: Viết logic (ví dụ: prisma.user.findUnique({ where: { user_id: userId } }))
	return { id: userId, name: "Tên User" };
};

const updateUser = async (userId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.user.update({ where: ..., data: ... }))
	return { id: userId, ...updateData };
};

const deleteUser = async (userId) => {
	// TODO: Viết logic (ví dụ: prisma.user.delete({ where: ... }))
	return { message: "Xóa thành công" };
};

const getUserBids = async (userId) => {
	// TODO: Viết logic (ví dụ: prisma.bid.findMany({ where: { bidder_id: userId } }))
	return [];
};

module.exports = {
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getUserBids,
};
