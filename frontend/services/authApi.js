import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const authApi = {
	login: async (loginData) => {
		try {
			const response = await fetch(`${BASE_URL}/auth/sign-in`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(loginData),
			});
			return handleResponse(response); // Xử lý và parse JSON
		} catch (err) {
			handleError(err);
		}
	},

	register: async (registerData) => {
		try {
			const response = await fetch(`${BASE_URL}/auth/sign-up`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(registerData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	logout: async () => {
		try {
			const response = await fetch(`${BASE_URL}/auth/log-out`, {
				method: "POST",
				headers: getFetchHeaders(), // Cần token
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default authApi;
