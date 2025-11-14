const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const productController = require("../controller/ProductController");

const routes = express.Router();

routes.get("/products", productController.getAllProductsController);
routes.get("/products/{id}", productController.getProductByIdController);

routes.post(
	"/products",
	authenticateToken,
	productController.createProductController
);
routes.patch(
	"/products",
	authenticateToken,
	productController.updateProductController
);
routes.delete(
	"/products",
	authenticateToken,
	productController.deleteProductController
);

module.exports = routes;
