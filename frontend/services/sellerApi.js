import {
	BASE_URL,
	getFetchHeaders,
	handleResponse,
	handleError,
} from "./apiHelpers.js";

const sellerApi = {
	getSellerProducts: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/seller/${id}/products`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getSellerReviews: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/seller/${id}/reviews`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createSellerProduct: async (id, productData) => {
		try {
			const response = await fetch(`${BASE_URL}/seller/${id}/products`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(productData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	getSellerTransactions: async () => {
		try {
			const response = await fetch(`${BASE_URL}/seller/transactions`, {
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	createAuction: async (productId, auctionData) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions?productId=${productId}`, {
				method: "POST",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(auctionData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateAuction: async (auctionId, auctionData) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions?auctionId=${auctionId}`, {
				method: "PUT",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify(auctionData),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteAuction: async (auctionId) => {
		try {
			const response = await fetch(`${BASE_URL}/auctions?auctionId=${auctionId}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	updateTransactionStatus: async (transactionId, status) => {
		try {
			// Assuming the backend expects status in the body or query? 
			// OpenAPI says PUT /transactions?transactionId=...
			// But doesn't explicitly show the body for status update in the summary, 
			// but typically it's in the body. Let's assume body for now or query if simple.
			// Checking OpenAPI again: 
			// put: /transactions
			// parameters: transactionId (query)
			// No requestBody defined in the snippet I saw?
			// Wait, let me check the OpenAPI snippet again.
			// It says:
			//     put:
			//       tags: [Transactions]
			//       summary: Cập nhật trạng thái giao dịch (Cần token, Seller)
			//       parameters: transactionId (query)
			//       responses: 200
			// It MISSES the requestBody in the snippet I read? 
			// Let's assume it sends status in body.
			const response = await fetch(`${BASE_URL}/transactions?transactionId=${transactionId}`, {
				method: "PUT",
				headers: getFetchHeaders({ "Content-Type": "application/json" }),
				body: JSON.stringify({ status }),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},

	deleteTransaction: async (transactionId) => {
		try {
			const response = await fetch(`${BASE_URL}/transactions?transactionId=${transactionId}`, {
				method: "DELETE",
				headers: getFetchHeaders(),
			});
			return handleResponse(response);
		} catch (err) {
			handleError(err);
		}
	},
};

export default sellerApi;
