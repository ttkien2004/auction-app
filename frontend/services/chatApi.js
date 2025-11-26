import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const chatApi = {
	getConversationByProductId: async (productId) => {
		try {
			const response = await fetch(
				`${BASE_URL}/chat/conversations/product/${productId}`,
				{
					headers: getFetchHeaders({ "Content-Type": "application/json" }),
				}
			);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default chatApi;
