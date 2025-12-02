import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const MoMoApi = {
	createPayment: async (transactionId) => {
		try {
			const response = await fetch(`${BASE_URL}/momo/create`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify({ transactionId }),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default MoMoApi;
