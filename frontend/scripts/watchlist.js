// DỮ LIỆU GIẢ LẬP
const mockWatchlist = [
	{
		id: 1,
		name: "Laptop Gaming XYZ Cũ",
		type: "Auction",
		price: 10500000, // Giá hiện tại
		endTime: new Date(Date.now() + 86400000).toISOString(), // +1 ngày
		image: "https://placehold.co/300x200?text=Laptop",
	},
	{
		id: 2,
		name: "Áo khoác da nam",
		type: "DirectSale",
		price: 1200000,
		endTime: null,
		image: "https://placehold.co/300x200?text=Jacket",
	},
	{
		id: 3,
		name: "Đồng hồ Omega Cổ",
		type: "Auction",
		price: 5000000,
		endTime: new Date(Date.now() - 100000).toISOString(), // Đã kết thúc
		image: "https://placehold.co/300x200?text=Watch",
	},
	{
		id: 4,
		name: "Tai nghe Bluetooth",
		type: "DirectSale",
		price: 500000,
		endTime: null,
		image: "https://placehold.co/300x200?text=Headphone",
	},
];

const grid = document.getElementById("watchlist-grid");
const emptyState = document.getElementById("empty-state");
const filters = document.querySelectorAll(".filter-btn");

// Biến lưu dữ liệu hiện tại (để lọc)
let currentData = [...mockWatchlist];

document.addEventListener("DOMContentLoaded", () => {
	renderList(currentData);
});

// Xử lý lọc
filters.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		// UI Active
		filters.forEach((b) => b.classList.remove("active"));
		e.target.classList.add("active");

		const type = e.target.dataset.filter;

		if (type === "all") {
			renderList(currentData);
		} else {
			const filtered = currentData.filter((item) => item.type === type);
			renderList(filtered);
		}
	});
});

// Hàm Render
function renderList(items) {
	if (items.length === 0) {
		grid.innerHTML = "";
		grid.classList.add("d-none");
		emptyState.classList.remove("d-none");
		return;
	}

	grid.classList.remove("d-none");
	emptyState.classList.add("d-none");

	const html = items
		.map((item) => {
			const isAuction = item.type === "Auction";
			const link = isAuction
				? `../html/auction/detail.html?id=${item.id}`
				: `../html/product-detail.html?id=${item.id}`;

			// Xử lý thời gian
			let timeLabel = "Mua ngay";
			let timeClass = "";

			if (isAuction) {
				const end = new Date(item.endTime).getTime();
				const now = new Date().getTime();

				if (end < now) {
					timeLabel = "ĐÃ KẾT THÚC";
					timeClass = "text-alert"; // Màu đỏ
				} else {
					// Tính sơ bộ
					const hours = Math.floor((end - now) / (1000 * 60 * 60));
					timeLabel = `${hours}H LEFT`;
				}
			}

			return `
        <div class="col">
            <div class="watch-card" onclick="window.location.href='${link}'" style="cursor: pointer;">
                <button class="btn-remove-watch" onclick="removeFromWatchlist(event, ${
									item.id
								})">
                    <i class="fas fa-trash-alt"></i>
                </button>
                
                <div class="card-img" style="background-image: url('${
									item.image
								}')"></div>
                
                <div class="card-info">
                    <div>
                        <div class="w-name" title="${item.name}">${
				item.name
			}</div>
                        <div class="w-price">${formatMoney(item.price)}</div>
                    </div>
                    
                    <div class="w-meta">
                        <span>${isAuction ? "Current Bid" : "Price"}</span>
                        <span class="${timeClass}">${timeLabel}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
		})
		.join("");

	grid.innerHTML = html;
}

// Hàm xóa (Gắn vào window để gọi từ HTML)
window.removeFromWatchlist = (event, id) => {
	event.stopPropagation(); // Ngăn nhảy trang chi tiết

	if (confirm("Bỏ theo dõi sản phẩm này?")) {
		// Xóa khỏi mảng dữ liệu
		currentData = currentData.filter((item) => item.id !== id);
		// Render lại
		renderList(currentData);
		// (Trong thực tế: Gọi API DELETE /api/watchlist/:id)
	}
};

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}
