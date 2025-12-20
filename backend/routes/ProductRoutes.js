const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const productController = require("../controller/ProductController");

const routes = express.Router();

routes.get("/products", productController.getAllProductsController);
routes.get("/products/:productId", productController.getProductByIdController);

routes.post(
	"/products",
	authenticateToken,
	upload.single("image"),
	productController.createProductController
);
// routes.patch(
// 	"/products",
// 	authenticateToken,
// 	productController.updateProductController
// );
// routes.delete(
// 	"/products",
// 	authenticateToken,
// 	productController.deleteProductController
// );

module.exports = routes;
