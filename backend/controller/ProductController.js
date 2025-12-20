// controllers/ProductController.js
const ProductService = require("../services/ProductService");
const R2Service = require("../services/R2Service");

const getAllProductsController = async (req, res, next) => {
	try {
		const { productId, ...filters } = req.query; // Dành cho việc lọc/phân trang
		if (productId) {
			const products = await ProductService.getProductById(productId);
			res.status(200).json(products);
		}
		const products = await ProductService.getProducts(filters);
		res.status(200).json(products);
	} catch (error) {
		next(error);
	}
};

const getProductByIdController = async (req, res, next) => {
	try {
		const { productId } = req.params;
		console.log(productId);
		const product = await ProductService.getProductById(Number(productId));
		res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const createProductController = async (req, res, next) => {
	try {
		const sellerId = req.user.id; // Lấy từ auth middleware
		let imageFileName = null;
		if (req.file) {
			imageFileName = await R2Service.uploadImage(req.file);
		}
		const productData = { ...req.body, image: imageFileName };
		// const newProduct = await ProductService.createProduct({ ...productData, seller_id: sellerId });
		const newProduct = await ProductService.createProduct(
			productData,
			parseInt(sellerId)
		);
		res.status(201).json(newProduct);
	} catch (error) {
		next(error);
	}
};

const updateProductController = async (req, res, next) => {
	try {
		const { id } = req.query;
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
		const { id } = req.query;
		await ProductService.deleteProduct(parseInt(id), parseInt(req.user.id));
		res.status(204).json({ message: "Delete successfully" });
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
