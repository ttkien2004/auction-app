// TODO: Dùng file này cho việc gọi đến các Api services
import sellerApi from "../services/sellerApi.js";

document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const productListContainer = document.getElementById("product-list");
    const transactionListContainer = document.getElementById("transaction-list");
    const createProductForm = document.getElementById("create-product-form");
    const createAuctionForm = document.getElementById("create-auction-form");

    // --- Helper Functions ---
    const renderProducts = (products) => {
        if (!productListContainer) return;
        productListContainer.innerHTML = products
            .map(
                (p) => `
            <div class="product-item" data-id="${p.id}">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <button class="create-auction-btn" data-id="${p.id}">Create Auction</button>
            </div>
        `
            )
            .join("");

        // Attach event listeners to new buttons
        document.querySelectorAll(".create-auction-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = e.target.dataset.id;
                // Populate hidden field in auction form if it exists, or show modal
                console.log("Prepare to create auction for product:", productId);
                // Example: document.getElementById('auction-product-id').value = productId;
            });
        });
    };

    const renderTransactions = (transactions) => {
        if (!transactionListContainer) return;
        transactionListContainer.innerHTML = transactions
            .map(
                (t) => `
            <div class="transaction-item">
                <p>Order ID: ${t.id}</p>
                <p>Status: ${t.status}</p>
                <p>Amount: ${t.amount}</p>
                <button class="update-status-btn" data-id="${t.id}" data-status="SHIPPED">Mark Shipped</button>
            </div>
        `
            )
            .join("");

        document.querySelectorAll(".update-status-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const { id, status } = e.target.dataset;
                await sellerApi.updateTransactionStatus(id, status);
                loadTransactions(); // Reload
            });
        });
    };

    // --- Actions ---
    const loadProducts = async () => {
        // Assuming we have the seller ID stored or available. 
        // For now, let's assume a placeholder or get it from local storage/auth context
        const sellerId = localStorage.getItem("userId"); // Example
        if (sellerId) {
            const products = await sellerApi.getSellerProducts(sellerId);
            if (products && Array.isArray(products)) {
                renderProducts(products);
            }
        }
    };

    const loadTransactions = async () => {
        const transactions = await sellerApi.getSellerTransactions();
        if (transactions && Array.isArray(transactions)) {
            renderTransactions(transactions);
        }
    };

    // --- Event Listeners ---
    if (createProductForm) {
        createProductForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(createProductForm);
            const productData = Object.fromEntries(formData.entries());
            const sellerId = localStorage.getItem("userId");

            if (sellerId) {
                await sellerApi.createSellerProduct(sellerId, productData);
                loadProducts();
                createProductForm.reset();
            }
        });
    }

    if (createAuctionForm) {
        createAuctionForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(createAuctionForm);
            const auctionData = Object.fromEntries(formData.entries());
            const productId = auctionData.productId; // Ensure form has this field

            await sellerApi.createAuction(productId, auctionData);
            alert("Auction created!");
            createAuctionForm.reset();
        });
    }

    // Refresh Button
    const refreshBtn = document.getElementById("refresh-products-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadProducts);
    }

    // --- Initial Load ---
    loadProducts();
    loadTransactions();
});
