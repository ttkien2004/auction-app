// services/TransactionService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllTransactions = async () => {
	// TODO: Viết logic (ví dụ: prisma.transaction.findMany())
	return [];
};

const getTransactionById = async (transactionId, userId) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.findUnique({ where: ... }))
	const transaction = await prisma.transaction.findUnique({
		where: {
			ID: transactionId,
		},
		select: {
			Product: true,
			Buyer: true,
			Review: true,
		},
	});
	if (!transaction) {
		throw new Error("Not found transaction");
	}
	if (transaction.Buyer.user_ID === userId) {
		return transaction;
	}
	throw new Error("Forbidden to access this service");
};

const createTransaction = async (transactionData) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.create({ data: ... }))
	const { buyer_ID, product_ID, final_amount, item_type } = transactionData;
	return await prisma.transaction.create({
		data: {
			buyer_ID: buyer_ID,
			product_ID: product_ID,
			final_amount: parseFloat(final_amount),
			item_type: item_type,
			status: "pending",
		},
	});
};

const updateTransaction = async (transactionId, updateData, userId) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.update({ where: ..., data: ... }))
	const { status } = updateData;
	if (!status) {
		throw new Error("Missing status for this transaction");
	}
	const transaction = await prisma.transaction.findUnique({
		where: { ID: transactionId },
		include: {
			Product: true, // Lấy sản phẩm để biết ai là người bán
		},
	});
	if (!transaction) {
		throw new Error("Not found transaction");
	}

	const isSeller = transaction.Product.seller_ID === userId;

	if (isSeller) {
		return prisma.transaction.update({
			where: { ID: transactionId },
			data: {
				status: status,
			},
		});
	}
	throw new Error("Forbidden to access this service");
};

const deleteTransaction = async (transactionId, userId) => {
	// TODO: Viết logic (ví dụ: prisma.transaction.delete({ where: ... }))
	return prisma.$transaction(async (tx) => {
		const transaction = await tx.transaction.findUnique({
			where: {
				ID: transactionId,
			},
		});
		if (!transaction) {
			throw new Error("Not found transaction");
		}
		const isOwner = transaction.buyer_ID === userId;
		if (!isOwner) {
			throw new Error("Forbidden to access this service");
		}
		if (transaction.status !== "pending") {
			throw new Error("Cannot delete this transaction due to status");
		}
		await tx.review.deleteMany({
			where: {
				transaction_ID: transaction.ID,
			},
		});
		await tx.transaction.delete({
			where: {
				ID: transaction.ID,
			},
		});
		return { message: "Delete successfully" };
	});
};

module.exports = {
	getAllTransactions,
	getTransactionById,
	createTransaction,
	updateTransaction,
	deleteTransaction,
};
