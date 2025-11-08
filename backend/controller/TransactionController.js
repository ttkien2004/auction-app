// controllers/TransactionController.js
const TransactionService = require("../services/TransactionService");

const getAllTransactionsController = async (req, res, next) => {
	try {
		const transactions = await TransactionService.getAllTransactions();
		res.status(200).json(transactions);
	} catch (error) {
		next(error);
	}
};

const getTransactionByIdController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const transaction = await TransactionService.getTransactionById(Number(id));
		res.status(200).json(transaction);
	} catch (error) {
		next(error);
	}
};

const createTransactionController = async (req, res, next) => {
	try {
		const { id } = req.params; // ID này có vẻ không cần thiết, tùy logic của bạn
		const transactionData = req.body;
		const newTransaction = await TransactionService.createTransaction(
			transactionData
		);
		res.status(201).json(newTransaction);
	} catch (error) {
		next(error);
	}
};

const updateTransactionController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updateData = req.body; // Thường là { status: "shipped" }
		const updatedTransaction = await TransactionService.updateTransaction(
			Number(id),
			updateData
		);
		res.status(200).json(updatedTransaction);
	} catch (error) {
		next(error);
	}
};

const deleteTransactionController = async (req, res, next) => {
	try {
		const { id } = req.params;
		await TransactionService.deleteTransaction(Number(id));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllTransactionsController,
	getTransactionByIdController,
	createTransactionController,
	updateTransactionController,
	deleteTransactionController,
};
