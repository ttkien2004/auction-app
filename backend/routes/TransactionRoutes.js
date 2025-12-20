const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const transactionController = require("../controller/TransactionController");

const routes = express.Router();

// routes.get(
// 	"/transactions",
// 	authenticateToken,
// 	transactionController.getAllTransactionsController
// );
routes.get(
	"/transactions",
	authenticateToken,
	transactionController.getTransactionByIdController
);
routes.post(
	"/transactions",
	authenticateToken,
	transactionController.createTransactionController
);
routes.put(
	"/transactions",
	authenticateToken,
	transactionController.updateTransactionController
);
routes.delete(
	"/transactions",
	authenticateToken,
	transactionController.deleteTransactionController
);

module.exports = routes;
