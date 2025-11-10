// services/TransactionService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllTransactions = async () => {
	// TODO: Viết logic (ví dụ: prisma.transaction.findMany())
	return [];
};

const getTransactionById = async (transactionId) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.findUnique({ where: ... }))
	return { id: transactionId };
};

const createTransaction = async (id, transactionData) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.create({ data: ... }))
	return { ...transactionData };
};

const updateTransaction = async (transactionId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.update({ where: ..., data: ... }))
	return { id: transactionId, ...updateData };
};

const deleteTransaction = async (transactionId) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.delete({ where: ... }))
	return { message: "Xóa thành công" };
};

module.exports = {
	getAllTransactions,
	getTransactionById,
	createTransaction,
	updateTransaction,
	deleteTransaction,
};
