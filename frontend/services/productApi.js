import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const productApi = {
	getAllProducts: async (params) => {
		try {
			// Xây dựng query string nếu có
			const url = new URL(`${BASE_URL}/products`);
			if (params) {
				Object.keys(params).forEach((key) =>
					url.searchParams.append(key, params[key])
				);
			}

			const response = await fetch(url.toString(), {
				method: "GET",
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getProductById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/products/${id}`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createProduct: async (productData) => {
		try {
			const response = await fetch(`${BASE_URL}/products`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(productData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateProduct: async (id, updateData) => {
		try {
			const response = await fetch(`${BASE_URL}/products/${id}`, {
				method: "PATCH", // (Bạn dùng PATCH trong route)
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(updateData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteProduct: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/products/${id}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response); // Sẽ trả về {} nếu thành công (204 No Content)
		} catch (err) {
			handleError(err);
		}
	},
};

export default productApi;
