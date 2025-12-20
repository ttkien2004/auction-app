// import productApi from "../services/productApi.js";

// const state = {
// 	currentType: "DirectSale", // Mặc định
// 	filters: { minPrice: null, maxPrice: null },
// };

// // DOM Elements
// const authSection = document.getElementById("auth-section");
// const filterSection = document.getElementById("filter-section");
// const productList = document.getElementById("product-list");
// const tabButtons = document.querySelectorAll(".tab-btn");
// const btnApplyFilter = document.getElementById("apply-filter-btn");
// const dailyTitle = document.querySelector(".discover-top");
// const stripCardsContainer = document.getElementById("strip-container");

// document.addEventListener("DOMContentLoaded", async () => {
// 	// 1. CHECK LOGIN
// 	const token = localStorage.getItem("token");
// 	const userStr = localStorage.getItem("user");

// 	if (token && userStr) {
// 		const user = JSON.parse(userStr);

// 		// Hiện Filter
// 		filterSection.style.display = "block";
// 		// dailyTitle.style.display = "none"; // (Tùy chọn: có thể giữ lại tiêu đề nếu muốn)
// 	} else {
// 		authSection.innerHTML = `<a href="auth/index.html" class="btn-login">Đăng Nhập</a>`;
// 	}

// 	// 2. LOAD SẢN PHẨM (Chạy song song)
// 	// Gọi DirectSale để render Grid
// 	loadProducts("DirectSale");
// 	// Gọi Auction để render Strip (Carousel)
// 	loadProducts("Auction");

// 	// 3. SỰ KIỆN TAB
// 	tabButtons.forEach((btn) => {
// 		btn.addEventListener("click", (e) => {
// 			// Update UI Tab
// 			tabButtons.forEach((b) => b.classList.remove("active"));
// 			e.target.classList.add("active");

// 			// Update State & Reload
// 			state.currentType = e.target.dataset.type;
// 			// Gọi loadProducts không tham số -> nó sẽ dùng state.currentType
// 			loadProducts();
// 		});
// 	});

// 	// 4. SỰ KIỆN LỌC
// 	if (btnApplyFilter) {
// 		btnApplyFilter.addEventListener("click", () => {
// 			state.filters.minPrice = document.getElementById("min-price").value;
// 			state.filters.maxPrice = document.getElementById("max-price").value;
// 			loadProducts(); // Load lại theo tab hiện tại
// 		});
// 	}
// });

// /**
//  * Hàm load sản phẩm
//  * @param {string} typeOverride - (Tùy chọn) Ép buộc load loại cụ thể (DirectSale/Auction)
//  */
// async function loadProducts(typeOverride) {
// 	// Xác định loại cần load: Dùng tham số truyền vào HOẶC dùng state hiện tại của Tab
// 	const typeToLoad = typeOverride || state.currentType;

// 	if (typeToLoad === "DirectSale") {
// 		productList.innerHTML =
// 			'<p style="width:100%; text-align:center">Đang tải...</p>';
// 	}
// 	// ----------------------------------------------

// 	try {
// 		const params = {
// 			type: typeToLoad,
// 			limit: 12,
// 			...state.filters,
// 			// status: "active",
// 		};

// 		const response = await productApi.getAllProducts(params);
// 		const products = response.data || [];

// 		if (typeToLoad === "DirectSale") {
// 			renderGrid(products);
// 		} else {
// 			renderAuctionCard(products);
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		if (typeToLoad === "DirectSale") {
// 			productList.innerHTML = "<p>Lỗi tải dữ liệu</p>";
// 		}
// 	}
// }

// // function renderGrid(products) {
// // 	if (!products.length) {
// // 		productList.innerHTML =
// // 			'<p style="width:100%; text-align:center">Không tìm thấy sản phẩm.</p>';
// // 		return;
// // 	}

// // 	const html = products
// // 		.map((p) => {
// // 			// Logic hiển thị giá và nhãn
// // 			const isAuction = p.type === "Auction"; // Check theo data thực tế
// // 			const label = isAuction ? "GIÁ ĐẶT HIỆN TẠI" : "GIÁ";

// // 			const priceRaw = isAuction
// // 				? p.Auction?.start_price || 0
// // 				: p.DirectSale?.buy_now_price || 0;

// // 			const price = new Intl.NumberFormat("vi-VN", {
// // 				style: "currency",
// // 				currency: "VND",
// // 			}).format(priceRaw);

// // 			const timeLabel = isAuction
// // 				? `Ends: ${new Date(p.Auction?.auc_end_time).toLocaleDateString()}`
// // 				: "Mua ngay";

// // 			const img = p.imageUrl || "assets/products/cat.png";

// // 			return `
// //         <article class="discover-card" onclick="window.location.href='./${
// // 					isAuction ? "/auction/index.html" : `/product-detail/index.html`
// // 				}?id=${p.ID}'" style="cursor:pointer">
// //           <div class="discover-img" style="background-image:url('${img}')"></div>
// //           <div class="discover-info">
// //             <span class="label">${label}</span>
// //             <span class="price">${price}</span>
// //             <span class="time-left">${timeLabel}</span>
// //           </div>
// //         </article>
// //         `;
// // 		})
// // 		.join("");

// // 	productList.innerHTML = html;
// // }

// function renderGrid(products) {
// 	const productList = document.getElementById("product-list");

// 	if (!products.length) {
// 		productList.innerHTML =
// 			'<p style="width:100%; text-align:center">Không tìm thấy sản phẩm.</p>';
// 		return;
// 	}

// 	const html = products
// 		.map((p) => {
// 			const isAuction = state.currentType === "Auction"; // Hoặc check p.type
// 			const label = isAuction ? "GIÁ CAO NHẤT HIỆN TẠI" : "GIÁ";

// 			// --- LOGIC BANNER TRẠNG THÁI ---
// 			let bannerHTML = "";
// 			let imgClass = "";

// 			// Giả sử API trả về field p.status hoặc p.quantity
// 			// Logic: Nếu status là sold_out HOẶC số lượng = 0
// 			if (p.status === "sold" || p.quantity === 0) {
// 				bannerHTML = `<div class="status-ribbon status-sold-out">Hết hàng</div>`;
// 				imgClass = "img-sold-out"; // Làm xám ảnh
// 			} else if (p.status === "active") {
// 				// Tùy chọn: Có thể hiện chữ "Mới" hoặc không hiện gì
// 				bannerHTML = `<div class="status-ribbon status-active">Mới</div>`;
// 			}

// 			// 1. Xử lý Giá
// 			const priceRaw = isAuction
// 				? p.Auction?.start_price || 0
// 				: p.DirectSale?.buy_now_price || 0;
// 			const price = new Intl.NumberFormat("vi-VN", {
// 				style: "currency",
// 				currency: "VND",
// 			}).format(priceRaw);

// 			// 2. Xử lý Thời gian (Chỉ cho Auction)
// 			let timeDisplay = "";
// 			let timeClass = ""; // Class để đổi màu

// 			if (isAuction && p.Auction?.auc_end_time) {
// 				const timeLeft = calculateTimeLeft(p.Auction.auc_end_time);

// 				// Nếu hết hạn -> Màu đỏ, ngược lại màu mặc định (hoặc xanh/đen tùy CSS cũ)
// 				if (timeLeft.isExpired) {
// 					timeClass = "color: #d32f2f; font-weight: bold;"; // Màu đỏ
// 				}
// 				timeDisplay = timeLeft.text;
// 			} else if (!isAuction) {
// 				timeDisplay = "Mua ngay";
// 			}

// 			// 3. Xử lý Ảnh
// 			const img = p.imageUrl || "assets/products/cat.png";
// 			const link = `./${
// 				isAuction ? "auction/index.html" : "product-detail/index.html"
// 			}?id=${p.ID}`;

// 			// 4. Lấy tên người bán
// 			const sellerName = p.Seller?.User?.name || "Unknown Seller";

// 			return `
//         <article class="discover-card" onclick="window.location.href='${link}'" style="cursor:pointer">
//           <div class="discover-img ${imgClass}" style="background-image:url('${img}')">${bannerHTML}</div>
//           <div class="discover-info">

//             <h5 style="font-size: 1rem; margin: 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
//                 ${p.name}
//             </h5>

//             <div style="font-size: 1.2rem; margin-bottom: 5px; opacity: 0.9;">
//                 <i class="fas fa-user-circle"></i> ${sellerName}
//             </div>

//             <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px;">
//                 <div>
//                     <span class="label" style="font-size: 1rem; display:block; opacity:0.8">${label}</span>
//                     <span class="price" style="font-size: 1.1rem; font-weight:bold;">${price}</span>
//                 </div>

//                 <span class="time-left" style="font-size: 0.7rem; ${timeClass}">
//                     ${timeDisplay}
//                 </span>
//             </div>

//           </div>
//         </article>
//         `;
// 		})
// 		.join("");

// 	productList.innerHTML = html;
// }

// // function renderAuctionCard(products) {
// // 	if (!products.length) return;

// // 	console.log(products);
// // 	const html = products
// // 		.map((p) => {
// // 			const priceRaw = p.Auction?.start_price || 0;
// // 			const price = new Intl.NumberFormat("vi-VN", {
// // 				style: "currency",
// // 				currency: "VND",
// // 			}).format(priceRaw);

// // 			const timeLabel = `Ends: ${new Date(
// // 				p.Auction?.auc_end_time
// // 			).toLocaleDateString()}`;

// // 			const img = p.imageUrl || "assets/products/cat.png";

// // 			return `
// //         <article class="strip-card" onclick="window.location.href='./auction/index.html?id=${p.ID}'" style="cursor:pointer">
// //             <div class="strip-card-img" style="background-image: url('${img}')"></div>
// //             <div class="strip-card-info">
// //                 <span class="price">${price}</span>
// //                 <span class="time-left">${timeLabel}</span>
// //             </div>
// //         </article>
// //         `;
// // 		})
// // 		.join("");

// // 	stripCardsContainer.innerHTML = html;

// // 	// initAutoScroll();
// // 	// -----------------------------------------------------
// // }
// function renderAuctionCard(products) {
// 	if (!products.length) return;

// 	const html = products
// 		.map((p) => {
// 			// 1. Giá khởi điểm
// 			console.log(p.name);
// 			const priceRaw = p.Auction?.start_price || 0;
// 			const price = new Intl.NumberFormat("vi-VN", {
// 				style: "currency",
// 				currency: "VND",
// 			}).format(priceRaw);

// 			// 2. Thời gian đếm ngược & Màu sắc
// 			// let timeDisplay = "";
// 			// let timeStyle = "opacity: 0.9; font-size: 1rem"; // Mặc định màu trắng (vì nền xanh)

// 			// const timerId = `timer-strip-${p.ID}`;
// 			// let endTimeAttr = "";
// 			// if (p.Auction?.auc_end_time) {
// 			// 	const timeLeft = calculateTimeLeft(p.Auction.auc_end_time);

// 			// 	// timeDisplay = timeLeft.text;
// 			// 	endTimeAttr = `data-endtime="${p.Auction.auc_end_time}"`;

// 			// 	if (timeLeft.isExpired) {
// 			// 		// Nếu hết hạn: Màu đỏ đậm hoặc vàng nổi bật trên nền xanh
// 			// 		timeStyle = "color: #d32f2f; font-weight: bold;";
// 			// 	}
// 			// }
// 			let bannerHTML = "";
// 			let imgClass = "";

// 			// Kiểm tra thời gian
// 			let timeStyle = "opacity: 0.9; font-size: 1rem";
// 			let endTimeAttr = "";
// 			const timerId = `timer-strip-${p.ID}`;

// 			if (p.Auction?.auc_end_time) {
// 				const timeLeft = calculateTimeLeft(p.Auction.auc_end_time);
// 				endTimeAttr = `data-endtime="${p.Auction.auc_end_time}"`;

// 				if (timeLeft.isExpired) {
// 					// Đấu giá kết thúc
// 					bannerHTML = `<div class="status-ribbon status-sold-out">Kết thúc</div>`;
// 					imgClass = "img-sold-out";
// 					timeStyle = "color: #d32f2f; font-weight: bold;";
// 				} else {
// 					// Đang diễn ra
// 					bannerHTML = `<div class="status-ribbon status-active">Đấu giá</div>`;
// 				}
// 			}

// 			// 3. Ảnh và Link
// 			const img = p.imageUrl || "assets/products/cat.png";
// 			const link = `./auction/index.html?id=${p.ID}`; // Chỉnh lại đường dẫn cho đúng

// 			// 4. Tên người bán
// 			const sellerName = p.Seller?.User?.name || "Unknown";

// 			// HTML Card (Thêm Tên SP và Người bán)

// 			return `
//         <article class="strip-card" onclick="window.location.href='${link}'" style="cursor:pointer">
//             <div class="strip-card-img ${imgClass}" style="background-image: url('${img}')">${bannerHTML}</div>

//             <div class="strip-card-info">
//                 <h5 style="font-size: 1rem; margin: 0 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
//                     ${p.name}
//                 </h5>

//                 <div style="font-size: 1rem; margin-bottom: 8px; opacity: 0.8;">
//                     <i class="fas fa-user"></i> ${sellerName}
//                 </div>

//                 <span class="price" style="font-size: 1.1rem; display:block; margin-bottom:2px;">${price}</span>

//                 <span class="time-left" style="${timeStyle}" id="${timerId}" ${endTimeAttr}>Đang tải...</span>
//             </div>
//         </article>
//         `;
// 		})
// 		.join("");

// 	stripCardsContainer.innerHTML = html;

// 	// bộ đếm ngược tg
// 	startCountdown();
// }

// // --- Event Listeners cho Filter (Giữ nguyên) ---
// document.querySelectorAll(".sort-tag").forEach((btn) => {
// 	btn.addEventListener("click", (e) => {
// 		document
// 			.querySelectorAll(".sort-tag")
// 			.forEach((b) => b.classList.remove("active"));
// 		e.target.classList.add("active");
// 		loadProducts();
// 	});
// });

// document.querySelectorAll(".cat-tag").forEach((btn) => {
// 	btn.addEventListener("click", (e) => {
// 		e.target.classList.toggle("active");
// 		// Logic filter category...
// 	});
// });

// // --- Logic Auto Scroll ---
// function initAutoScroll() {
// 	const container = document.getElementById("strip-container");
// 	if (!container) return;

// 	// Reset lại container (để tránh nhân đôi nhiều lần nếu gọi hàm này nhiều lần)
// 	// Tuy nhiên, cách đơn giản nhất là chỉ clone 1 lần.
// 	// Đoạn code này giả định hàm chỉ chạy 1 lần sau khi render.

// 	// 1. Nhân đôi nội dung
// 	const originalContent = container.innerHTML;
// 	container.innerHTML = originalContent.repeat(4);

// 	const scrollSpeed = 1;
// 	const refreshRate = 15;

// 	let scrollInterval;

// 	const startScrolling = () => {
// 		// Xóa interval cũ nếu có để tránh chồng chéo
// 		if (scrollInterval) clearInterval(scrollInterval);

// 		scrollInterval = setInterval(() => {
// 			// Nếu đã cuộn hết 1 nửa (hết nội dung gốc) -> Reset về 0
// 			// container.scrollWidth / 2 chính là độ dài của nội dung gốc
// 			if (container.scrollLeft >= container.scrollWidth / 2) {
// 				container.scrollLeft = 0;
// 			} else {
// 				container.scrollLeft += scrollSpeed;
// 			}
// 		}, refreshRate);
// 	};

// 	startScrolling();

// 	container.addEventListener("mouseenter", () => {
// 		clearInterval(scrollInterval);
// 	});

// 	container.addEventListener("mouseleave", () => {
// 		startScrolling();
// 	});
// }

// /**
//  * Hàm tính thời gian còn lại
//  * Trả về object: { text: string, isExpired: boolean }
//  */
// function calculateTimeLeft(endTimeISO) {
// 	if (!endTimeISO) return { text: "", isExpired: false };

// 	const now = new Date().getTime();
// 	const end = new Date(endTimeISO).getTime();
// 	const distance = end - now;

// 	// Nếu đã qua thời gian kết thúc
// 	if (distance < 0) {
// 		return { text: "ĐÃ KẾT THÚC", isExpired: true };
// 	}

// 	// Tính toán ngày, giờ, phút
// 	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
// 	const hours = Math.floor(
// 		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// 	);
// 	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

// 	let timeString = "";
// 	if (days > 0) timeString += `${days}D `;
// 	if (hours > 0) timeString += `${hours}H `;
// 	timeString += `${minutes}M LEFT`;

// 	return { text: timeString, isExpired: false };
// }

// let countdownInterval;
// function startCountdown() {
// 	// 1. Xóa interval cũ nếu có (để tránh chạy chồng chéo)
// 	if (countdownInterval) clearInterval(countdownInterval);

// 	// 2. Định nghĩa hàm cập nhật
// 	const updateTimers = () => {
// 		const now = new Date().getTime();

// 		// Tìm tất cả các element có data-endtime
// 		const timerElements = document.querySelectorAll("[data-endtime]");

// 		timerElements.forEach((el) => {
// 			const endTimeISO = el.getAttribute("data-endtime");
// 			const endTime = new Date(endTimeISO).getTime();
// 			const distance = endTime - now;

// 			if (distance < 0) {
// 				el.innerText = "ĐÃ KẾT THÚC";
// 				el.style.color = "red";
// 				el.style.fontWeight = "bold";
// 			} else {
// 				// Tính toán Ngày, Giờ, Phút, Giây
// 				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
// 				const hours = Math.floor(
// 					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// 				);
// 				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
// 				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

// 				// Format chuỗi: 1d 05:30:20
// 				// PadStart(2, '0') để luôn hiện 2 số (ví dụ 05 thay vì 5)
// 				let timeString = "";
// 				if (days > 0) timeString += `${days}d `;
// 				timeString += `${hours.toString().padStart(2, "0")}:${minutes
// 					.toString()
// 					.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

// 				el.innerText = timeString + " LEFT";
// 				el.style.color = ""; // Reset màu
// 			}
// 		});
// 	};

// 	// 3. Gọi ngay lập tức 1 lần để không bị delay 1 giây đầu
// 	updateTimers();

// 	// 4. Lặp lại mỗi 1 giây (1000ms)
// 	countdownInterval = setInterval(updateTimers, 1000);
// }

import productApi from "../services/productApi.js";

// QUẢN LÝ TRẠNG THÁI (STATE)
const state = {
	currentType: "DirectSale", // Mặc định
	filters: {
		minPrice: null,
		maxPrice: null,
		search: "",
		sortBy: "relevance", // relevance | newest
		categoryId: null,
	},
};

// DOM Elements
const authSection = document.getElementById("auth-section");
const filterSection = document.getElementById("filter-section");
const productList = document.getElementById("product-list");
const stripCardsContainer = document.getElementById("strip-container");

document.addEventListener("DOMContentLoaded", async () => {
	// 1. CHECK LOGIN
	const token = localStorage.getItem("token");
	const userStr = localStorage.getItem("user");

	if (token && userStr) {
		// Hiện Filter nếu đã login
		if (filterSection) filterSection.style.display = "block";
	} else {
		if (authSection)
			authSection.innerHTML = `<a href="auth/index.html" class="btn-login">Đăng Nhập</a>`;
	}

	// 2. LOAD SẢN PHẨM BAN ĐẦU
	loadProducts("DirectSale");
	loadProducts("Auction");

	// 3. KHỞI TẠO CÁC SỰ KIỆN (FILTERS)
	initFilterEvents();
});

function initFilterEvents() {
	// A. Xử lý Tab (DirectSale / Auction) - Nếu bạn có tab ở đâu đó
	const tabButtons = document.querySelectorAll(".tab-btn");
	tabButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			tabButtons.forEach((b) => b.classList.remove("active"));
			e.target.classList.add("active");
			state.currentType = e.target.dataset.type;
			loadProducts();
		});
	});

	// B. Xử lý Tìm kiếm (Search)
	const btnSearch = document.getElementById("btn-search-icon");
	const inputSearch = document.getElementById("filter-name");

	if (btnSearch && inputSearch) {
		const handleSearch = () => {
			const val = inputSearch.value.trim();
			state.filters.name = val;
			loadProducts("DirectSale");
		};

		btnSearch.addEventListener("click", handleSearch);
		inputSearch.addEventListener("keypress", (e) => {
			if (e.key === "Enter") handleSearch();
		});
	}

	// C. Xử lý Giá (Price)
	const btnApplyPrice = document.getElementById("btn-apply-price");
	if (btnApplyPrice) {
		btnApplyPrice.addEventListener("click", () => {
			state.filters.minPrice = document.getElementById("min-price").value;
			state.filters.maxPrice = document.getElementById("max-price").value;
			loadProducts("DirectSale");
		});
	}

	// D. Xử lý Sắp xếp (Sort)
	const sortBtns = document.querySelectorAll(".filter-tag[data-sort]");
	sortBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			// UI: Xóa active cũ, thêm active mới
			sortBtns.forEach((b) => b.classList.remove("active"));
			e.target.classList.add("active");

			// Logic
			state.filters.sortBy = e.target.dataset.sort;
			loadProducts("DirectSale");
		});
	});

	// E. Xử lý Danh mục (Category)
	const catBtns = document.querySelectorAll(".filter-tag[data-cat]");
	catBtns.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			// Đảm bảo lấy đúng element có data-cat (đề phòng click vào icon bên trong nếu có)
			const targetBtn = e.target.closest(".filter-tag");
			if (!targetBtn) return;

			const catId = targetBtn.dataset.cat;
			console.log("Selected Category ID:", catId); // Debug

			// UI Toggle
			if (targetBtn.classList.contains("active")) {
				// Nếu đang chọn -> Hủy chọn (Toggle off)
				targetBtn.classList.remove("active");
				state.filters.categoryId = null;
			} else {
				// Nếu chưa chọn -> Chọn mới (Toggle on)
				// Reset các nút khác (nếu chỉ muốn chọn 1 category tại 1 thời điểm)
				catBtns.forEach((b) => b.classList.remove("active"));
				targetBtn.classList.add("active");
				state.filters.categoryId = catId;
			}

			loadProducts("DirectSale");
		});
	});
}

/**
 * Hàm load sản phẩm
 * @param {string} typeOverride - "DirectSale" hoặc "Auction"
 */
async function loadProducts(typeOverride) {
	const typeToLoad = typeOverride || state.currentType;

	// Chỉ hiện loading nếu đang load Grid chính
	if (typeToLoad === "DirectSale" && productList) {
		productList.innerHTML =
			'<p style="width:100%; text-align:center; padding: 20px;">Đang tìm kiếm...</p>';
	}

	try {
		// Chuẩn bị params gửi lên API
		const limitCount = typeToLoad === "Auction" ? 50 : 12;
		const params = {
			type: typeToLoad,
			limit: limitCount,

			...state.filters,
		};

		// Xóa các key null/rỗng để URL sạch hơn
		Object.keys(params).forEach((key) => {
			if (params[key] === null || params[key] === "") delete params[key];
		});

		const response = await productApi.getAllProducts(params);
		const products = response.data || [];

		if (typeToLoad === "DirectSale") {
			renderGrid(products);
		} else {
			renderAuctionCard(products);
		}
	} catch (error) {
		console.error(error);
		if (typeToLoad === "DirectSale" && productList) {
			productList.innerHTML =
				'<p class="text-danger text-center w-100">Lỗi tải dữ liệu. Vui lòng thử lại.</p>';
		}
	}
}

// --- RENDER GRID (Sản phẩm thường) ---
function renderGrid(products) {
	if (!productList) return;

	if (!products.length) {
		productList.innerHTML = `
            <div style="width: 100%; text-align:center; padding: 40px; grid-column: 1/-1; border: 1px solid red">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <p>Không tìm thấy sản phẩm phù hợp.</p>
            </div>`;
		return;
	}

	const html = products
		.map((p) => {
			const isAuction = state.currentType === "Auction";
			const label = isAuction ? "GIÁ CAO NHẤT" : "GIÁ";

			// Logic Banner
			let bannerHTML = "";
			let imgClass = "";
			if (p.status === "sold" || p.quantity === 0) {
				bannerHTML = `<div class="status-ribbon status-sold-out">Hết hàng</div>`;
				imgClass = "img-sold-out";
			} else if (p.status === "active") {
				bannerHTML = `<div class="status-ribbon status-active">Mới</div>`;
			}

			// Giá
			const priceRaw = isAuction
				? p.Auction?.start_price || 0
				: p.DirectSale?.buy_now_price || 0;

			const price = new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(priceRaw);

			// Ảnh
			const img = p.imageUrl || "assets/products/cat.png";
			const link = `./${
				isAuction ? "auction/index.html" : "product-detail/index.html"
			}?id=${p.ID}`;
			const sellerName = p.Seller?.User?.name || "Người bán";

			// Thời gian (nếu là đấu giá)
			let timeDisplay = !isAuction ? "Mua ngay" : "";
			let timeClass = "";
			if (isAuction && p.Auction?.auc_end_time) {
				const timeLeft = calculateTimeLeft(p.Auction.auc_end_time);
				if (timeLeft.isExpired) {
					timeClass = "color: #d32f2f; font-weight: bold;";
					bannerHTML = `<div class="status-ribbon status-sold-out">Kết thúc</div>`;
					imgClass = "img-sold-out";
				}
				timeDisplay = timeLeft.text;
			}

			return `
        <article class="discover-card" onclick="window.location.href='${link}'" style="cursor:pointer">
          <div class="discover-img ${imgClass}" style="background-image:url('${img}')">${bannerHTML}</div>
          <div class="discover-info">
            <h5 style="font-size: 1rem; margin: 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${p.name}
            </h5>
            <div style="font-size: 0.9rem; margin-bottom: 5px; opacity: 0.8; color: #555">
                <i class="fas fa-user-circle"></i> ${sellerName}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px;">
                <div>
                    <span class="label" style="font-size: 0.8rem; display:block; opacity:0.8">${label}</span>
                    <span class="price" style="font-size: 1.1rem; font-weight:bold">${price}</span>
                </div>
                <span class="time-left" style="font-size: 0.7rem; ${timeClass}">${timeDisplay}</span>
            </div>
          </div>
        </article>
        `;
		})
		.join("");

	productList.innerHTML = html;
}

// --- RENDER STRIP (Sản phẩm đấu giá ngang) ---
function renderAuctionCard(products) {
	if (!stripCardsContainer || !products.length) return;
	const now = new Date().getTime();
	const html = products
		.map((p) => {
			const priceRaw = p.Auction?.start_price || 0;
			const price = formatMoney(priceRaw);

			// Lấy thời gian
			const startTimeStr = p.Auction?.auc_start_time;
			const endTimeStr = p.Auction?.auc_end_time;
			const startTime = new Date(startTimeStr).getTime();
			const endTime = new Date(endTimeStr).getTime();
			let statusText = "Đang tải...";
			let dataAttrs = ""; // Lưu thời gian vào DOM để JS xử lý đếm ngược
			// Logic Banner & Time
			let bannerHTML = "";
			let imgClass = "";
			let timeStyle = "opacity: 0.9; font-size: 1rem";
			let endTimeAttr = "";
			const timerId = `timer-strip-${p.ID}`;

			// Case 1: Đã kết thúc
			if (now >= endTime) {
				bannerHTML = `<div class="status-ribbon status-sold-out">Kết thúc</div>`;
				imgClass = "img-sold-out";
				timeStyle += ";color: #d32f2f;"; // Đỏ
				statusText = "ĐÃ KẾT THÚC";
				dataAttrs = `data-status="ended"`;
			}
			// Case 2: Sắp diễn ra (Chưa đến giờ bắt đầu)
			else if (now < startTime) {
				console.log("Hello dang dien ra");
				bannerHTML = `<div class="status-ribbon" style="background: #ff9800;">Sắp diễn ra</div>`; // Màu cam
				timeStyle += ";color: #e67e22;"; // Cam
				statusText = "Sắp bắt đầu...";
				// Truyền cả start và end để bộ đếm tự chuyển trạng thái
				dataAttrs = `data-status="upcoming" data-start="${startTimeStr}" data-end="${endTimeStr}"`;
			}
			// Case 3: Đang diễn ra (Trong khoảng Start - End)
			else {
				bannerHTML = `<div class="status-ribbon status-active">Đang đấu giá</div>`;
				timeStyle += ";color: #2ecc71;"; // Xanh lá
				statusText = "Đang diễn ra...";
				dataAttrs = `data-status="active" data-end="${endTimeStr}"`;
			}

			const img = p.imageUrl || "assets/products/cat.png";
			const link = `./auction/index.html?id=${p.ID}`;
			const sellerName = p.Seller?.User?.name || "Người bán";

			return `
        <article class="strip-card" onclick="window.location.href='${link}'" style="cursor:pointer">
            <div class="strip-card-img ${imgClass}" style="background-image: url('${img}')">${bannerHTML}</div>
            <div class="strip-card-info">
                <h5 style="font-size: 1rem; margin: 0 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</h5>
                <div style="font-size: 0.9rem; margin-bottom: 8px; opacity: 0.8;">
                    <i class="fas fa-user"></i> ${sellerName}
                </div>
                <span class="price" style="font-size: 1.1rem; display:block; margin-bottom:2px;">${price}</span>
                <span class="time-left" style="${timeStyle}" id="${timerId}" ${dataAttrs}>${statusText}</span>
            </div>
        </article>
        `;
		})
		.join("");

	stripCardsContainer.innerHTML = html;
	startCountdown();
}

// --- UTILS ---

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}

function calculateTimeLeft(endTimeISO, startTimeISO) {
	if (!endTimeISO) return { text: "", isExpired: false, isUpcoming: false };

	const now = new Date().getTime();
	const end = new Date(endTimeISO).getTime();
	const start = startTimeISO ? new Date(startTimeISO).getTime() : 0;

	// 1. Kiểm tra SẮP DIỄN RA
	if (now < start) {
		const distance = start - now;
		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

		// Format text: "Mở sau: 2d 5h"
		let timeString = "Mở sau: ";
		if (days > 0) timeString += `${days}d `;
		timeString += `${hours}h ${minutes}m`;

		return { text: timeString, isExpired: false, isUpcoming: true };
	}

	// 2. Kiểm tra ĐÃ KẾT THÚC
	const distance = end - now;
	if (distance < 0) {
		return { text: "ĐÃ KẾT THÚC", isExpired: true, isUpcoming: false };
	}

	// 3. ĐANG DIỄN RA
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

	let timeString = "";
	if (days > 0) timeString += `${days}D `;
	if (hours > 0) timeString += `${hours}H `;
	timeString += `${minutes}M LEFT`;

	return { text: timeString, isExpired: false, isUpcoming: false };
}
let countdownInterval;

function startCountdown() {
	if (countdownInterval) clearInterval(countdownInterval);

	const updateTimers = () => {
		const now = new Date().getTime();

		// Lấy tất cả các thẻ có data-status (trừ những cái đã ended thì thôi ko cần update)
		const timerElements = document.querySelectorAll(".time-left[data-status]");

		timerElements.forEach((el) => {
			const status = el.getAttribute("data-status");

			if (status === "ended") return; // Bỏ qua

			let targetTime = 0;
			let prefix = "";
			let newStatus = status; // Dùng để check chuyển trạng thái

			if (status === "upcoming") {
				// Đếm ngược tới lúc Bắt đầu
				const startTime = new Date(el.getAttribute("data-start")).getTime();
				targetTime = startTime;
				prefix = "Mở sau: ";

				// Nếu thời gian hiện tại đã vượt qua Start Time -> Chuyển sang Active ngay lập tức
				if (now >= startTime) {
					newStatus = "active";
					// Cập nhật lại Attribute để vòng lặp sau xử lý theo kiểu Active
					el.setAttribute("data-status", "active");
					// Đổi màu chữ sang xanh (CSS inline)
					el.style.color = "#2ecc71";
					// (Optional) Bạn có thể reload lại danh sách sản phẩm nếu muốn cập nhật banner
				}
			}

			if (newStatus === "active") {
				// Đếm ngược tới lúc Kết thúc
				// Lưu ý: Nếu vừa chuyển từ upcoming sang active, cần lấy data-end
				const endTimeStr =
					el.getAttribute("data-end") || el.getAttribute("data-endtime"); // Support legacy attr
				targetTime = new Date(endTimeStr).getTime();
				prefix = "Còn lại: ";
			}

			const distance = targetTime - now;

			if (distance < 0) {
				// Hết giờ
				if (newStatus === "active") {
					el.innerText = "ĐÃ KẾT THÚC";
					el.style.color = "#d32f2f";
					el.setAttribute("data-status", "ended");
				}
			} else {
				// Tính toán hiển thị
				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				let timeString = "";
				if (days > 0) timeString += `${days}d `;
				timeString += `${hours.toString().padStart(2, "0")}:${minutes
					.toString()
					.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

				el.innerText = prefix + timeString;
			}
		});
	};

	updateTimers(); // Chạy ngay lập tức
	countdownInterval = setInterval(updateTimers, 1000);
}
