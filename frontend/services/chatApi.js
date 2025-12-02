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
					headers: getFetchHeaders(),
				}
			);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
	getConversations: async () => {
		try {
			const response = await fetch(`${BASE_URL}/chat/conversations`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
	getConversationById: async (conversationId) => {
		try {
			const response = await fetch(
				`${BASE_URL}/chat/conversations/${conversationId}`,
				{
					headers: getFetchHeaders(),
				}
			);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
	startConversation: async (productId, partnerId) => {
		try {
			const response = await fetch(`${BASE_URL}/chat/conversations/start`, {
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify({ productId, partnerId }),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default chatApi;
