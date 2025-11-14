// services/CategoryService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCategories = async (queryParams) => {
	if (queryParams) {
		const { id } = queryParams;
		return await getCategoryById(id);
	}
	return await getAllCategories();
};
const getAllCategories = async () => {
	// TODO: Viết logic (ví dụ: prisma.category.findMany())
	return await prisma.category.findMany({
		where: {
			parent_category_ID: null,
		},
		include: {
			other_Category: true,
		},
	});
};

const getCategoryById = async (categoryId) => {
	// TODO: Viết logic (ví dụ: prisma.category.findUnique({ where: ... }))
	const category = await prisma.category.findUnique({
		where: {
			ID: categoryId,
		},
		include: {
			other_Category: true,
			Category: true,
		},
	});
	if (!category) {
		throw new Error("Category not found");
	}
	return category;
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
	getCategories,
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
