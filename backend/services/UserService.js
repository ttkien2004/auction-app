// services/UserService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword, comparePassword } = require("../utils/hash.js");
const { hash } = require("bcrypt");

const getUsers = (query) => {
	const { userId } = query;
	if (userId) {
		return getUserById(parseInt(userId));
	}
	return getAllUsers();
};
const getAllUsers = async () => {
	// TODO: Viết logic (ví dụ: prisma.user.findMany())
	return prisma.user.findMany();
};

const getUserById = async (userId) => {
	// TODO: Viết logic (ví dụ: prisma.user.findUnique({ where: { user_id: userId } }))
	if (!userId) {
		throw Error("ID not valid");
	}
	const existedUser = await prisma.user.findUnique({
		where: {
			ID: userId,
		},
		select: {
			username: true,
			email: true,
			phone_number: true,
			address: true,
			avatar: true,
			ghn_district_id: true,
			ghn_province_id: true,
			ghn_ward_code: true,
		},
	});
	if (!existedUser) {
		throw Error("User not found");
	}
	return existedUser;
};

const updateUser = async (userId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.user.update({ where: ..., data: ... }))
	if (isNaN(userId)) {
		throw Error("ID not valid");
	}
	let hashedPassword;
	if (Object.keys(updateData).includes("password")) {
		hashedPassword = await hashPassword(updateData.password);
		updateData.password = hashedPassword;
	}
	const {
		name,
		address,
		phone_number,
		ghn_province_id,
		ghn_district_id,
		ghn_ward_code,
	} = updateData;
	const updatedUser = await prisma.user.update({
		where: {
			ID: userId,
		},
		data: {
			name,
			address,
			phone_number,
			ghn_district_id: Number(ghn_district_id),
			ghn_province_id: Number(ghn_province_id),
			ghn_ward_code,
		},
		select: {
			username: true,
			address: true,
			phone_number: true,
			email: true,
			ghn_district_id: true,
			ghn_province_id: true,
			ghn_ward_code: true,
		},
	});
	return updatedUser;
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
	getUsers,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getUserBids,
};
