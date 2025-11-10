import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const buyerApi = {
	getBuyerTransactions: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/buyer/${id}/transactions`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getBuyerBids: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/buyer/${id}/bids`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getBuyerReviews: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/buyer/${id}/reviews`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default buyerApi;
