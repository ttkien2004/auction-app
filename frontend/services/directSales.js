import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const directSalesApi = {
	getAllDirectSales: async () => {
		try {
			const response = await fetch(`${BASE_URL}/direct-sales`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getDirectSaleById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/direct-sales/${id}`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createDirectSale: async (saleData) => {
		try {
			const response = await fetch(`${BASE_URL}/direct-sales`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(saleData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	buyDirectSale: async (id, shippingBody) => {
		try {
			const response = await fetch(
				`${BASE_URL}/direct-sales/buy?directSaleId=${id}`,
				{
					method: "POST",
					headers: getFetchHeaders({ "Content-Type": "application/json" }),
					body: shippingBody,
				}
			);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateDirectSale: async (id, updateData) => {
		try {
			const response = await fetch(`${BASE_URL}/direct-sales/${id}`, {
				method: "PUT",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(updateData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteDirectSale: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/direct-sales/${id}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default directSalesApi;
