// services/ProductService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllProducts = async (filters) => {
	// TODO: Viết logic (ví dụ: prisma.product.findMany({ where: filters }))
	return [];
};

const getProductById = async (productId) => {
	// TODO: Viết logic (ví dụ: prisma.product.findUnique({ where: { product_id: productId } }))
	return { id: productId };
};

const createProduct = async (productData) => {
	// TODO: Viết logic (ví dụ: prisma.product.create({ data: productData }))
	return productData;
};

const updateProduct = async (productId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.product.update({ where: ..., data: updateData }))
	return { id: productId, ...updateData };
};

const deleteProduct = async (productId) => {
	// TODO: Viết logic (ví dụ: prisma.product.delete({ where: ... }))
	return { message: "Xóa thành công" };
};

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
