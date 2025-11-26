import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const sellerApi = {
	getSellerProducts: async () => {
		try {
			const response = await fetch(`${BASE_URL}/seller/products`, {
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getSellerReviews: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/seller/${id}/reviews`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createSellerProduct: async (id, productData) => {
		try {
			const response = await fetch(`${BASE_URL}/seller/${id}/products`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(productData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default sellerApi;
