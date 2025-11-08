// services/CategoryService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllCategories = async () => {
	// TODO: Viết logic (ví dụ: prisma.category.findMany())
	return [];
};

const getCategoryById = async (categoryId) => {
	// TODO: Viết logic (ví dụ: prisma.category.findUnique({ where: ... }))
	return { id: categoryId };
};

const createCategory = async (categoryData) => {
	// TODO: Viết logic (ví dụ: prisma.category.create({ data: ... }))
	return categoryData;
};

const updateCategory = async (categoryId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.category.update({ where: ..., data: ... }))
	return { id: categoryId, ...updateData };
};

const deleteCategory = async (categoryId) => {
	// TODO: Viết logic (ví dụ: prisma.category.delete({ where: ... }))
	return { message: "Xóa thành công" };
};

module.exports = {
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
