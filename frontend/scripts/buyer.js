// TODO: Dùng file này cho việc gọi đến các Api services
import buyerApi from "../services/buyerApi.js";

document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const transactionListContainer = document.getElementById("buyer-transaction-list");
    const bidListContainer = document.getElementById("buyer-bid-list");
    const placeBidForm = document.getElementById("place-bid-form");

    // --- Helper Functions ---
    const renderTransactions = (transactions) => {
        if (!transactionListContainer) return;
        transactionListContainer.innerHTML = transactions
            .map(
                (t) => `
            <div class="transaction-item">
                <p>Order ID: ${t.id}</p>
                <p>Status: ${t.status}</p>
                <p>Amount: ${t.amount}</p>
            </div>
        `
            )
            .join("");
    };

    const renderBids = (bids) => {
        if (!bidListContainer) return;
        bidListContainer.innerHTML = bids
            .map(
                (b) => `
            <div class="bid-item">
                <p>Auction ID: ${b.auction_id}</p>
                <p>Amount: ${b.bid_amount}</p>
                <p>Time: ${new Date(b.created_at).toLocaleString()}</p>
            </div>
        `
            )
            .join("");
    };

    // --- Actions ---
    const loadTransactions = async () => {
        const buyerId = localStorage.getItem("userId");
        if (buyerId) {
            const transactions = await buyerApi.getBuyerTransactions(buyerId);
            if (transactions && Array.isArray(transactions)) {
                renderTransactions(transactions);
            }
        }
    };

    const loadBids = async () => {
        const buyerId = localStorage.getItem("userId");
        if (buyerId) {
            const bids = await buyerApi.getBuyerBids(buyerId);
            if (bids && Array.isArray(bids)) {
                renderBids(bids);
            }
        }
    };

    // --- Event Listeners ---
    // Example: Join Auction Button (delegated)
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("join-auction-btn")) {
            const auctionId = e.target.dataset.id;
            await buyerApi.joinAuction(auctionId);
            alert("Joined auction successfully!");
        }
    });

    // Example: Buy Now Button (delegated)
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("buy-now-btn")) {
            const directSaleId = e.target.dataset.id;
            // In a real app, you'd probably open a modal to get address/note
            const purchaseData = {
                address: "Default Address", // Placeholder
                note: "Quick buy",
                phone: "0000000000",
                to_province_id: 1, // Placeholder
                to_district_id: 1, // Placeholder
                to_ward_code: "1A0101", // Placeholder
            };
            await buyerApi.buyDirectSale(directSaleId, purchaseData);
            alert("Purchase successful!");
            loadTransactions();
        }
    });

    if (placeBidForm) {
        placeBidForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(placeBidForm);
            const auctionId = formData.get("auctionId");
            const bidAmount = formData.get("bidAmount");

            if (auctionId && bidAmount) {
                await buyerApi.placeBid(auctionId, Number(bidAmount));
                alert("Bid placed!");
                loadBids();
                placeBidForm.reset();
            }
        });
    }

    // Refresh Button
    const refreshBtn = document.getElementById("refresh-bids-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadBids);
    }

    // --- Initial Load ---
    loadTransactions();
    loadBids();
});
