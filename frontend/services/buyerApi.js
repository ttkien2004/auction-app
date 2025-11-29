import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const buyerApi = {
	getBuyerTransactions: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/buyer/${id}/transactions`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getBuyerBids: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/buyer/${id}/bids`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getBuyerReviews: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/buyer/${id}/reviews`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	joinAuction: async (auctionId) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions/join?auctionId=${auctionId}`, {
				method: "POST",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	placeBid: async (auctionId, bidAmount) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions/bids?auctionId=${auctionId}`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify({ bid_amount: bidAmount }),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	buyDirectSale: async (directSaleId, purchaseData) => {
		try {
			const response = await fetch(`${BASE_URL}/direct-sales/buy?directSaleId=${directSaleId}`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(purchaseData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default buyerApi;
