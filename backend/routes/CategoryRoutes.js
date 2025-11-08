const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const categoryController = require("../controller/CategoryController");

const routes = express.Router();

routes.get("/categories", categoryController.getAllCategoriesController);
routes.get("/categories/{id}", categoryController.getCategoryByIdController);

routes.post(
	"/categories",
	authenticateToken,
	categoryController.createCategoryController
);
routes.put(
	"/categories/{id}",
	authenticateToken,
	categoryController.updateCategoryController
);
routes.delete(
	"/categories/{id}",
	authenticateToken,
	categoryController.deleteCategoryController
);

module.exports = routes;
