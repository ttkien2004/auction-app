import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const categoryApi = {
	getAllCategories: async () => {
		try {
			const response = await fetch(`${BASE_URL}/categories`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getCategoryById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/categories/${id}`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createCategory: async (categoryData) => {
		try {
			const response = await fetch(`${BASE_URL}/categories`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(categoryData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateCategory: async (id, updateData) => {
		try {
			const response = await fetch(`${BASE_URL}/categories/${id}`, {
				method: "PUT",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(updateData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteCategory: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/categories/${id}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default categoryApi;
