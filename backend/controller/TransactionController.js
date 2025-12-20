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
		const { id } = req.query;
		const transaction = await TransactionService.getTransactionById(
			Number(id),
			Number(req.user.id)
		);
		res.status(200).json(transaction);
	} catch (error) {
		next(error);
	}
};

const createTransactionController = async (req, res, next) => {
	try {
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
		const { transactionId } = req.query;
		const updateData = req.body; // Thường là { status: "shipped" }
		const updatedTransaction = await TransactionService.updateTransaction(
			Number(transactionId),
			updateData,
			Number(req.user.id)
		);
		res.status(200).json(updatedTransaction);
	} catch (error) {
		next(error);
	}
};

const deleteTransactionController = async (req, res, next) => {
	try {
		const { transactionId } = req.query;
		await TransactionService.deleteTransaction(
			Number(transactionId),
			Number(req.user.id)
		);
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
