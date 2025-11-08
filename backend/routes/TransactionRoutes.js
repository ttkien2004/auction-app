const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const transactionController = require("../controller/TransactionController");

const routes = express.Router();

routes.get(
	"/transactions",
	authenticateToken,
	transactionController.getAllTransactionsController
);
routes.get(
	"/transactions/{id}",
	authenticateToken,
	transactionController.getTransactionByIdController
);
routes.post(
	"/transactions/{id}",
	authenticateToken,
	transactionController.createTransactionController
);
routes.put(
	"/transactions/{id}",
	authenticateToken,
	transactionController.updateTransactionController
);
routes.delete(
	"/transactions/{id}",
	authenticateToken,
	transactionController.deleteTransactionController
);

module.exports = routes;
