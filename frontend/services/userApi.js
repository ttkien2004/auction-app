import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const userApi = {
	getAllUsers: async () => {
		try {
			const response = await fetch(`${BASE_URL}/users`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getUserById: async (userId) => {
		try {
			const response = await fetch(`${BASE_URL}/users/${userId}`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateUser: async (userId, updateData) => {
		try {
			const response = await fetch(`${BASE_URL}/users/${userId}`, {
				method: "PUT",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(updateData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteUser: async (userId) => {
		try {
			const response = await fetch(`${BASE_URL}/users/${userId}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getUserBids: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/users/${id}/bids`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default userApi;
