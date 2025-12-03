import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const transactionApi = {
	getAllTransactions: async () => {
		try {
			const response = await fetch(`${BASE_URL}/transactions`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getTransactionById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/transactions/${id}`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createTransaction: async (id, data) => {
		try {
			const response = await fetch(`${BASE_URL}/transactions/${id}`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(data),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateTransaction: async (id, updateData) => {
		try {
			const response = await fetch(
				`${BASE_URL}/transactions?transactionId=${id}`,
				{
					method: "PUT",
					headers: getFetchHeaders({ "Content-Type": "application/json" }),
					body: JSON.stringify(updateData),
				}
			);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteTransaction: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/transactions/${id}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default transactionApi;
