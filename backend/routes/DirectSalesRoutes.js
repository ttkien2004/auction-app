const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const directSalesController = require("../controller/DirectSalesController");

const routes = express.Router();

// routes.get("/direct-sales", directSalesController.getAllDirectSalesController);
// routes.get(
// 	"/direct-sales/{id}",
// 	directSalesController.getDirectSaleByIdController
// );

// routes.post(
// 	"/direct-sales",
// 	authenticateToken,
// 	directSalesController.createDirectSaleController
// );
routes.post(
	"/direct-sales/buy",
	authenticateToken,
	directSalesController.buyDirectSaleController
);
// routes.put(
// 	"/direct-sales/{id}",
// 	authenticateToken,
// 	directSalesController.updateDirectSaleController
// );
// routes.delete(
// 	"/direct-sales/{id}",
// 	authenticateToken,
// 	directSalesController.deleteDirectSaleController
// );

module.exports = routes;
