import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const cartApi = {
	addToCart: async (product) => {
		try {
			const response = await fetch(`${BASE_URL}/cart`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(product),
			});
			return handleResponse(response);
		} catch (err) {
			console.error(err);
		}
	},
	getCart: async () => {
		try {
			const response = await fetch(`${BASE_URL}/cart`, {
				method: "GET",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default cartApi;
