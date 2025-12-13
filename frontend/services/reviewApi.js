import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const reviewApi = {
	getAllReviews: async (transactionId) => {
		try {
			const response = await fetch(`${BASE_URL}/reviews/${transactionId}`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getReviewById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/reviews/${id}`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createReview: async (reviewData) => {
		try {
			const response = await fetch(`${BASE_URL}/reviews`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(reviewData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateReview: async (id, updateData) => {
		try {
			const response = await fetch(`${BASE_URL}/reviews/${id}`, {
				method: "PUT",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(updateData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteReview: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/reviews/${id}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getReviewsBySeller: async (sellerId) => {
		try {
			const response = await fetch(`${BASE_URL}/reviews/seller/${sellerId}`, {
				method: "GET",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default reviewApi;
