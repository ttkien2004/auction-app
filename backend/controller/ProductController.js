// controllers/ProductController.js
const ProductService = require("../services/ProductService");

const getAllProductsController = async (req, res, next) => {
	try {
		const filters = req.query; // Dành cho việc lọc/phân trang
		const products = await ProductService.getAllProducts(filters);
		res.status(200).json(products);
	} catch (error) {
		next(error);
	}
};

const getProductByIdController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const product = await ProductService.getProductById(Number(id));
		res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const createProductController = async (req, res, next) => {
	try {
		const productData = req.body;
		// const sellerId = req.user.id; // Lấy từ auth middleware
		// const newProduct = await ProductService.createProduct({ ...productData, seller_id: sellerId });
		const newProduct = await ProductService.createProduct(productData);
		res.status(201).json(newProduct);
	} catch (error) {
		next(error);
	}
};

const updateProductController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedProduct = await ProductService.updateProduct(
			Number(id),
			updateData
		);
		res.status(200).json(updatedProduct);
	} catch (error) {
		next(error);
	}
};

const deleteProductController = async (req, res, next) => {
	try {
		const { id } = req.params;
		await ProductService.deleteProduct(Number(id));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllProductsController,
	getProductByIdController,
	createProductController,
	updateProductController,
	deleteProductController,
};
