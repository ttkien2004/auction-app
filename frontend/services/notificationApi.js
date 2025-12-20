import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const notifApi = {
	getNotifications: async () => {
		try {
			const response = await fetch(`${BASE_URL}/notifications`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
	markNotification: async (notifId) => {
		try {
			const response = await fetch(
				`${BASE_URL}/notifications/${notifId}/read`,
				{
					method: "PUT",
					headers: getFetchHeaders(),
				}
			);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default notifApi;
