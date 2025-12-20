// import QueryString from "qs";
import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const auctionApi = {
	getAllAuctions: async () => {
		try {
			const response = await fetch(`${BASE_URL}/auctions`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getAuctionById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions?auctionId=${id}`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getBidsForAuction: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions/${id}/bids`);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createAuction: async (id, auctionData) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions/${id}`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(auctionData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateAuction: async (id, updateData) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions/${id}`, {
				method: "PUT",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(updateData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteAuction: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions/${id}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	joinAuction: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions/${id}/join`, {
				method: "POST",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	placeBid: async (id, bidData) => {
		try {
			const response = await fetch(
				`${BASE_URL}/auctions/bids?auctionId=${id}`,
				{
					method: "POST",
					headers: getFetchHeaders({ "Content-Type": "application/json" }),
					body: JSON.stringify(bidData),
				}
			);
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default auctionApi;
