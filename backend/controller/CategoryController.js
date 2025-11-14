// controllers/CategoryController.js
const CategoryService = require("../services/CategoryService");

const getAllCategoriesController = async (req, res, next) => {
	try {
		const categories = await CategoryService.getCategories(req.query);
		res.status(200).json(categories);
	} catch (error) {
		next(error);
	}
};

const getCategoryByIdController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const category = await CategoryService.getCategoryById(Number(id));
		res.status(200).json(category);
	} catch (error) {
		next(error);
	}
};

const createCategoryController = async (req, res, next) => {
	try {
		const categoryData = req.body;
		const newCategory = await CategoryService.createCategory(categoryData);
		res.status(201).json(newCategory);
	} catch (error) {
		next(error);
	}
};

const updateCategoryController = async (req, res, next) => {
	try {
		const { id } = req.query;
		const updateData = req.body;
		const updatedCategory = await CategoryService.updateCategory(
			Number(id),
			updateData
		);
		res.status(200).json(updatedCategory);
	} catch (error) {
		next(error);
	}
};

const deleteCategoryController = async (req, res, next) => {
	try {
		const { id } = req.query;
		await CategoryService.deleteCategory(Number(id));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllCategoriesController,
	getCategoryByIdController,
	createCategoryController,
	updateCategoryController,
	deleteCategoryController,
};
