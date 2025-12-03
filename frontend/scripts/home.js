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
	} else {
		authSection.innerHTML = `<a href="auth/index.html" class="btn-login">Đăng Nhập</a>`;
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
			// status: "active",
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

// function renderGrid(products) {
// 	if (!products.length) {
// 		productList.innerHTML =
// 			'<p style="width:100%; text-align:center">Không tìm thấy sản phẩm.</p>';
// 		return;
// 	}

// 	const html = products
// 		.map((p) => {
// 			// Logic hiển thị giá và nhãn
// 			const isAuction = p.type === "Auction"; // Check theo data thực tế
// 			const label = isAuction ? "GIÁ ĐẶT HIỆN TẠI" : "GIÁ";

// 			const priceRaw = isAuction
// 				? p.Auction?.start_price || 0
// 				: p.DirectSale?.buy_now_price || 0;

// 			const price = new Intl.NumberFormat("vi-VN", {
// 				style: "currency",
// 				currency: "VND",
// 			}).format(priceRaw);

// 			const timeLabel = isAuction
// 				? `Ends: ${new Date(p.Auction?.auc_end_time).toLocaleDateString()}`
// 				: "Mua ngay";

// 			const img = p.imageUrl || "assets/products/cat.png";

// 			return `
//         <article class="discover-card" onclick="window.location.href='./${
// 					isAuction ? "/auction/index.html" : `/product-detail/index.html`
// 				}?id=${p.ID}'" style="cursor:pointer">
//           <div class="discover-img" style="background-image:url('${img}')"></div>
//           <div class="discover-info">
//             <span class="label">${label}</span>
//             <span class="price">${price}</span>
//             <span class="time-left">${timeLabel}</span>
//           </div>
//         </article>
//         `;
// 		})
// 		.join("");

// 	productList.innerHTML = html;
// }

function renderGrid(products) {
	const productList = document.getElementById("product-list");

	if (!products.length) {
		productList.innerHTML =
			'<p style="width:100%; text-align:center">Không tìm thấy sản phẩm.</p>';
		return;
	}
	const html = products
		.map((p) => {
			const isAuction = state.currentType === "Auction"; // Hoặc check p.type
			const label = isAuction ? "GIÁ CAO NHẤT HIỆN TẠI" : "GIÁ";

			// 1. Xử lý Giá
			const priceRaw = isAuction
				? p.Auction?.start_price || 0
				: p.DirectSale?.buy_now_price || 0;
			const price = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(priceRaw);

			// 2. Xử lý Thời gian (Chỉ cho Auction)
			let timeDisplay = "";
			let timeClass = ""; // Class để đổi màu

			if (isAuction && p.Auction?.auc_end_time) {
				const timeLeft = calculateTimeLeft(p.Auction.auc_end_time);

				// Nếu hết hạn -> Màu đỏ, ngược lại màu mặc định (hoặc xanh/đen tùy CSS cũ)
				if (timeLeft.isExpired) {
					timeClass = "color: #d32f2f; font-weight: bold;"; // Màu đỏ
				}
				timeDisplay = timeLeft.text;
			} else if (!isAuction) {
				timeDisplay = "Mua ngay";
			}

			// 3. Xử lý Ảnh
			const img = p.imageUrl || "assets/products/cat.png";
			const link = `./${
				isAuction ? "auction/index.html" : "product-detail/index.html"
			}?id=${p.ID}`;

			// 4. Lấy tên người bán
			const sellerName = p.Seller?.User?.name || "Unknown Seller";

			return `
        <article class="discover-card" onclick="window.location.href='${link}'" style="cursor:pointer">
          <div class="discover-img" style="background-image:url('${img}')"></div>
          <div class="discover-info">
            
            <h5 style="font-size: 1rem; margin: 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${p.name}
            </h5>

            <div style="font-size: 1.2rem; margin-bottom: 5px; opacity: 0.9;">
                <i class="fas fa-user-circle"></i> ${sellerName}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px;">
                <div>
                    <span class="label" style="font-size: 1rem; display:block; opacity:0.8">${label}</span>
                    <span class="price" style="font-size: 1.1rem; font-weight:bold;">${price}</span>
                </div>
                
                <span class="time-left" style="font-size: 0.7rem; ${timeClass}">
                    ${timeDisplay}
                </span>
            </div>

          </div>
        </article>
        `;
		})
		.join("");

	productList.innerHTML = html;
}

// function renderAuctionCard(products) {
// 	if (!products.length) return;

// 	console.log(products);
// 	const html = products
// 		.map((p) => {
// 			const priceRaw = p.Auction?.start_price || 0;
// 			const price = new Intl.NumberFormat("vi-VN", {
// 				style: "currency",
// 				currency: "VND",
// 			}).format(priceRaw);

// 			const timeLabel = `Ends: ${new Date(
// 				p.Auction?.auc_end_time
// 			).toLocaleDateString()}`;

// 			const img = p.imageUrl || "assets/products/cat.png";

// 			return `
//         <article class="strip-card" onclick="window.location.href='./auction/index.html?id=${p.ID}'" style="cursor:pointer">
//             <div class="strip-card-img" style="background-image: url('${img}')"></div>
//             <div class="strip-card-info">
//                 <span class="price">${price}</span>
//                 <span class="time-left">${timeLabel}</span>
//             </div>
//         </article>
//         `;
// 		})
// 		.join("");

// 	stripCardsContainer.innerHTML = html;

// 	// initAutoScroll();
// 	// -----------------------------------------------------
// }
function renderAuctionCard(products) {
	if (!products.length) return;

	const html = products
		.map((p) => {
			// 1. Giá khởi điểm
			console.log(p.name);
			const priceRaw = p.Auction?.start_price || 0;
			const price = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(priceRaw);

			// 2. Thời gian đếm ngược & Màu sắc
			let timeDisplay = "";
			let timeStyle = "opacity: 0.9; font-size: 1rem"; // Mặc định màu trắng (vì nền xanh)

			const timerId = `timer-strip-${p.ID}`;
			let endTimeAttr = "";
			if (p.Auction?.auc_end_time) {
				const timeLeft = calculateTimeLeft(p.Auction.auc_end_time);

				// timeDisplay = timeLeft.text;
				endTimeAttr = `data-endtime="${p.Auction.auc_end_time}"`;

				if (timeLeft.isExpired) {
					// Nếu hết hạn: Màu đỏ đậm hoặc vàng nổi bật trên nền xanh
					timeStyle = "color: #d32f2f; font-weight: bold;";
				}
			}

			// 3. Ảnh và Link
			const img = p.imageUrl || "assets/products/cat.png";
			const link = `./auction/index.html?id=${p.ID}`; // Chỉnh lại đường dẫn cho đúng

			// 4. Tên người bán
			const sellerName = p.Seller?.User?.name || "Unknown";

			// HTML Card (Thêm Tên SP và Người bán)
			return `
        <article class="strip-card" onclick="window.location.href='${link}'" style="cursor:pointer">
            <div class="strip-card-img" style="background-image: url('${img}')"></div>
            
            <div class="strip-card-info">
                <h5 style="font-size: 1rem; margin: 0 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${p.name}
                </h5>
                
                <div style="font-size: 1rem; margin-bottom: 8px; opacity: 0.8;">
                    <i class="fas fa-user"></i> ${sellerName}
                </div>

                <span class="price" style="font-size: 1.1rem; display:block; margin-bottom:2px;">${price}</span>
                
                <span class="time-left" style="${timeStyle}" id="${timerId}" ${endTimeAttr}>Đang tải...</span>
            </div>
        </article>
        `;
		})
		.join("");

	stripCardsContainer.innerHTML = html;

	// bộ đếm ngược tg
	startCountdown();
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

/**
 * Hàm tính thời gian còn lại
 * Trả về object: { text: string, isExpired: boolean }
 */
function calculateTimeLeft(endTimeISO) {
	if (!endTimeISO) return { text: "", isExpired: false };

	const now = new Date().getTime();
	const end = new Date(endTimeISO).getTime();
	const distance = end - now;

	// Nếu đã qua thời gian kết thúc
	if (distance < 0) {
		return { text: "ĐÃ KẾT THÚC", isExpired: true };
	}

	// Tính toán ngày, giờ, phút
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

	let timeString = "";
	if (days > 0) timeString += `${days}D `;
	if (hours > 0) timeString += `${hours}H `;
	timeString += `${minutes}M LEFT`;

	return { text: timeString, isExpired: false };
}

let countdownInterval;
function startCountdown() {
	// 1. Xóa interval cũ nếu có (để tránh chạy chồng chéo)
	if (countdownInterval) clearInterval(countdownInterval);

	// 2. Định nghĩa hàm cập nhật
	const updateTimers = () => {
		const now = new Date().getTime();

		// Tìm tất cả các element có data-endtime
		const timerElements = document.querySelectorAll("[data-endtime]");

		timerElements.forEach((el) => {
			const endTimeISO = el.getAttribute("data-endtime");
			const endTime = new Date(endTimeISO).getTime();
			const distance = endTime - now;

			if (distance < 0) {
				el.innerText = "ĐÃ KẾT THÚC";
				el.style.color = "red";
				el.style.fontWeight = "bold";
			} else {
				// Tính toán Ngày, Giờ, Phút, Giây
				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				// Format chuỗi: 1d 05:30:20
				// PadStart(2, '0') để luôn hiện 2 số (ví dụ 05 thay vì 5)
				let timeString = "";
				if (days > 0) timeString += `${days}d `;
				timeString += `${hours.toString().padStart(2, "0")}:${minutes
					.toString()
					.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

				el.innerText = timeString + " LEFT";
				el.style.color = ""; // Reset màu
			}
		});
	};

	// 3. Gọi ngay lập tức 1 lần để không bị delay 1 giây đầu
	updateTimers();

	// 4. Lặp lại mỗi 1 giây (1000ms)
	countdownInterval = setInterval(updateTimers, 1000);
}
