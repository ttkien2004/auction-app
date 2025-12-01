import productApi from "../services/productApi.js";

const state = {
	currentType: "DirectSale", // Mặc định
	filters: { minPrice: null, maxPrice: null },
};

// DOM Elements
const authSection = document.getElementById("auth-section");
const filterSection = document.getElementById("filter-section");
const productList = document.getElementById("product-list");
const tabButtons = document.querySelectorAll(".tab-btn");
const btnApplyFilter = document.getElementById("apply-filter-btn");
const dailyTitle = document.querySelector(".discover-top");
const stripCardsContainer = document.getElementById("strip-container");

document.addEventListener("DOMContentLoaded", async () => {
	// 1. CHECK LOGIN
	const token = localStorage.getItem("token");
	const userStr = localStorage.getItem("user");

	if (token && userStr) {
		const user = JSON.parse(userStr);

		// Hiện Filter
		filterSection.style.display = "block";
		// dailyTitle.style.display = "none"; // (Tùy chọn: có thể giữ lại tiêu đề nếu muốn)

		const avatarUrl = "assets/images/avatar_main.png";
		authSection.innerHTML = `
            <a href="./profile/index.html" class="user-profile-link">
                <img src="${avatarUrl}" class="user-avatar" title="${user.name}">
            </a>
        `;
	}

	// 2. LOAD SẢN PHẨM (Chạy song song)
	// Gọi DirectSale để render Grid
	loadProducts("DirectSale");
	// Gọi Auction để render Strip (Carousel)
	loadProducts("Auction");

	// 3. SỰ KIỆN TAB
	tabButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			// Update UI Tab
			tabButtons.forEach((b) => b.classList.remove("active"));
			e.target.classList.add("active");

			// Update State & Reload
			state.currentType = e.target.dataset.type;
			// Gọi loadProducts không tham số -> nó sẽ dùng state.currentType
			loadProducts();
		});
	});

	// 4. SỰ KIỆN LỌC
	if (btnApplyFilter) {
		btnApplyFilter.addEventListener("click", () => {
			state.filters.minPrice = document.getElementById("min-price").value;
			state.filters.maxPrice = document.getElementById("max-price").value;
			loadProducts(); // Load lại theo tab hiện tại
		});
	}
});

/**
 * Hàm load sản phẩm
 * @param {string} typeOverride - (Tùy chọn) Ép buộc load loại cụ thể (DirectSale/Auction)
 */
async function loadProducts(typeOverride) {
	// Xác định loại cần load: Dùng tham số truyền vào HOẶC dùng state hiện tại của Tab
	const typeToLoad = typeOverride || state.currentType;

	if (typeToLoad === "DirectSale") {
		productList.innerHTML =
			'<p style="width:100%; text-align:center">Đang tải...</p>';
	}
	// ----------------------------------------------

	try {
		const params = {
			type: typeToLoad,
			limit: 12,
			...state.filters,
		};

		const response = await productApi.getAllProducts(params);
		const products = response.data || [];

		if (typeToLoad === "DirectSale") {
			renderGrid(products);
		} else {
			renderAuctionCard(products);
		}
	} catch (error) {
		console.error(error);
		if (typeToLoad === "DirectSale") {
			productList.innerHTML = "<p>Lỗi tải dữ liệu</p>";
		}
	}
}

function renderGrid(products) {
	if (!products.length) {
		productList.innerHTML =
			'<p style="width:100%; text-align:center">Không tìm thấy sản phẩm.</p>';
		return;
	}

	const html = products
		.map((p) => {
			// Logic hiển thị giá và nhãn
			const isAuction = p.type === "Auction"; // Check theo data thực tế
			const label = isAuction ? "GIÁ ĐẶT HIỆN TẠI" : "GIÁ";

			const priceRaw = isAuction
				? p.Auction?.start_price || 0
				: p.DirectSale?.buy_now_price || 0;

			const price = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(priceRaw);

			const timeLabel = isAuction
				? `Ends: ${new Date(p.Auction?.auc_end_time).toLocaleDateString()}`
				: "Mua ngay";

			const img = p.imageUrl || "assets/products/cat.png";

			return `
        <article class="discover-card" onclick="window.location.href='./${
					isAuction ? "/auction/index.html" : `/product-detail/index.html`
				}?id=${p.ID}'" style="cursor:pointer">
          <div class="discover-img" style="background-image:url('${img}')"></div>
          <div class="discover-info">
            <span class="label">${label}</span>
            <span class="price">${price}</span>
            <span class="time-left">${timeLabel}</span>
          </div>
        </article>
        `;
		})
		.join("");

	productList.innerHTML = html;
}

function renderAuctionCard(products) {
	if (!products.length) return;

	const html = products
		.map((p) => {
			const priceRaw = p.Auction?.start_price || 0;
			const price = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(priceRaw);

			const timeLabel = `Ends: ${new Date(
				p.Auction?.auc_end_time
			).toLocaleDateString()}`;

			const img = p.imageUrl || "assets/products/cat.png";

			return `
        <article class="strip-card" onclick="window.location.href='./auction/index.html?id=${p.ID}'" style="cursor:pointer">
            <div class="strip-card-img" style="background-image: url('${img}')"></div>
            <div class="strip-card-info">
                <span class="price">${price}</span>
                <span class="time-left">${timeLabel}</span>
            </div>
        </article>
        `;
		})
		.join("");

	stripCardsContainer.innerHTML = html;

	initAutoScroll();
	// -----------------------------------------------------
}

// --- Event Listeners cho Filter (Giữ nguyên) ---
document.querySelectorAll(".sort-tag").forEach((btn) => {
	btn.addEventListener("click", (e) => {
		document
			.querySelectorAll(".sort-tag")
			.forEach((b) => b.classList.remove("active"));
		e.target.classList.add("active");
		loadProducts();
	});
});

document.querySelectorAll(".cat-tag").forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.target.classList.toggle("active");
		// Logic filter category...
	});
});

// --- Logic Auto Scroll ---
function initAutoScroll() {
	const container = document.getElementById("strip-container");
	if (!container) return;

	// Reset lại container (để tránh nhân đôi nhiều lần nếu gọi hàm này nhiều lần)
	// Tuy nhiên, cách đơn giản nhất là chỉ clone 1 lần.
	// Đoạn code này giả định hàm chỉ chạy 1 lần sau khi render.

	// 1. Nhân đôi nội dung
	const originalContent = container.innerHTML;
	container.innerHTML = originalContent.repeat(4);

	const scrollSpeed = 1;
	const refreshRate = 15;

	let scrollInterval;

	const startScrolling = () => {
		// Xóa interval cũ nếu có để tránh chồng chéo
		if (scrollInterval) clearInterval(scrollInterval);

		scrollInterval = setInterval(() => {
			// Nếu đã cuộn hết 1 nửa (hết nội dung gốc) -> Reset về 0
			// container.scrollWidth / 2 chính là độ dài của nội dung gốc
			if (container.scrollLeft >= container.scrollWidth / 2) {
				container.scrollLeft = 0;
			} else {
				container.scrollLeft += scrollSpeed;
			}
		}, refreshRate);
	};

	startScrolling();

	container.addEventListener("mouseenter", () => {
		clearInterval(scrollInterval);
	});

	container.addEventListener("mouseleave", () => {
		startScrolling();
	});
}
