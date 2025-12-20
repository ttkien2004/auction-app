import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const paymentApi = {
	createMoMoPayment: async (transaction) => {
		try {
			const response = await fetch(`${BASE_URL}/momo/create`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: transaction,
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
	getMoMoResult: async () => {
		try {
			const res = await fetch(`${BASE_URL}/momo/result`, {
				method: "GET",
				headers: getFetchHeaders(),
			});
			return handleResponse(res);
		} catch (err) {
			handleError(err);
		}
	},
};

export default paymentApi;
