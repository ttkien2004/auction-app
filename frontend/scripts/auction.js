// import auctionApi from "../services/auctionApi.js";
// // (Nếu bạn có apiHelpers để format tiền thì import, không thì dùng hàm dưới)
// import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

// const socket = io("http://localhost:3000");

// // 1. Lấy ID từ URL (Ví dụ: auction.html?id=5)
// const urlParams = new URLSearchParams(window.location.search);
// const auctionId = urlParams.get("id");

// // 2. Lấy các Element từ DOM (theo ID mới trong HTML)
// const els = {
// 	productName: document.getElementById("product-name"),
// 	productImage: document.getElementById("product-image"),
// 	productDesc: document.getElementById("product-desc"),
// 	sellerName: document.getElementById("seller-name"),
// 	productCode: document.getElementById("product-code"),
// 	location: document.getElementById("product-location"),
// 	auctionTime: document.getElementById("auction-time"),
// 	startPrice: document.getElementById("start-price"),
// 	stepPrice: document.getElementById("step-price"),

// 	currentPrice: document.getElementById("current-price"),
// 	highestBidder: document.getElementById("highest-bidder"),

// 	bidInput: document.getElementById("bid-input"),
// 	btnPlaceBid: document.getElementById("btn-place-bid"),
// 	historyList: document.getElementById("history-list"),

// 	// Các element mới
// 	statusBadge: document.getElementById("auction-status-badge"),
// 	countdownTimer: document.getElementById("countdown-timer"),

// 	activeBidSection: document.getElementById("active-bid-info"),
// 	winnerSection: document.getElementById("winner-section"),
// 	winnerName: document.getElementById("winner-name"),
// 	winnerPrice: document.getElementById("winner-final-price"),
// 	minBidPrice: document.getElementById("min-bid-price"),
// };

// let auctionEndTime = null;
// let countdownInterval = null;
// let minBidInr = 0;

// document.addEventListener("DOMContentLoaded", async () => {
// 	if (!auctionId) {
// 		console.log(auctionId);
// 		// alert("Không tìm thấy ID phiên đấu giá. Quay lại trang chủ.");
// 		// window.location.href = "../index.html";
// 		console.log(urlParams);
// 		return;
// 	}

// 	// Kết nối Socket
// 	socket.emit("join_auction", auctionId);
// 	console.log(`Joined room: auction_${auctionId}`);

// 	// Tải dữ liệu
// 	await loadAuctionData();

// 	// Lắng nghe sự kiện Real-time
// 	socket.on("new_bid", (data) => {
// 		console.log("New Bid Recieved:", data);
// 		updateUI(data);
// 	});
// });

// // Xử lý Đặt giá
// els.btnPlaceBid.addEventListener("click", async () => {
// 	const amount = els.bidInput.value;
// 	if (!amount) return alert("Vui lòng nhập số tiền!");

// 	els.btnPlaceBid.disabled = true;
// 	els.btnPlaceBid.innerText = "Đang xử lý...";

// 	try {
// 		// Gọi API
// 		await auctionApi.placeBid(auctionId, { bid_amount: Number(amount) });

// 		// Reset input (Giao diện sẽ tự update nhờ socket)
// 		els.bidInput.value = "";
// 		alert("Đặt giá thành công!");
// 	} catch (error) {
// 		console.error(error);
// 		alert("Lỗi: " + "Không thể đặt giá");
// 		els.bidInput.value = "";
// 	} finally {
// 		els.btnPlaceBid.disabled = false;
// 		els.btnPlaceBid.innerText = "Xác nhận";
// 	}
// });

// async function loadAuctionData() {
// 	try {
// 		const response = await auctionApi.getAuctionById(auctionId);
// 		const auction = response.data || response; // Tùy cấu trúc trả về

// 		// --- XỬ LÝ THỜI GIAN & TRẠNG THÁI ---
// 		auctionEndTime = new Date(auction.auc_end_time).getTime();

// 		// Kiểm tra trạng thái ngay lúc load
// 		checkAuctionStatus(auction);

// 		// Bắt đầu đếm ngược
// 		startCountdown();

// 		if (!auction) throw new Error("No data");

// 		const product = auction.Product;
// 		minBidInr = formatMoney(auction.min_bid_incr);

// 		// --- ĐIỀN DỮ LIỆU VÀO HTML ---
// 		els.productName.innerText = product.name;
// 		els.productDesc.innerText = product.description;
// 		els.sellerName.innerText = product.Seller?.User?.name || "Ẩn danh";
// 		els.productCode.innerText = `AUC-${product.ID}`; // Tạo mã giả hoặc dùng ID
// 		els.location.innerText = product.Seller?.User?.address || "Toàn quốc";

// 		// Format thời gian
// 		const start = new Date(auction.auc_start_time).toLocaleString();
// 		const end = new Date(auction.auc_end_time).toLocaleString();
// 		els.auctionTime.innerText = `${start} - ${end}`;

// 		els.startPrice.innerText = formatMoney(auction.start_price);
// 		els.stepPrice.innerText = minBidInr;

// 		// Xử lý ảnh (Nếu có URL ảnh từ Cloudflare/Firebase)
// 		console.log(product.image);
// 		els.productImage.src =
// 			R2_PUBLIC_URL + product.image || "https://placehold.co/400";

// 		// --- XỬ LÝ LỊCH SỬ & GIÁ HIỆN TẠI ---
// 		const bids = auction.Bid || [];

// 		if (bids.length > 0) {
// 			const highestBid = bids[0];

// 			// Cập nhật giá & người thắng
// 			updateUI(
// 				{
// 					amount: highestBid.bid_amount,
// 					bidder_name: highestBid.Buyer?.User?.name || "Unknown",
// 					time: highestBid.bid_time,
// 					min_bid_incr: auction.min_buid_incr,
// 				},
// 				false
// 			); // false để không thêm trùng history

// 			// Render toàn bộ list lịch sử
// 			els.historyList.innerHTML = ""; // Xóa text "chưa có giá"
// 			bids.forEach((bid) => {
// 				addHistoryCard(bid.bid_amount, bid.Buyer?.User?.name, bid.bid_time);
// 			});
// 		} else {
// 			// Chưa có ai đặt
// 			els.currentPrice.innerText = formatMoney(auction.start_price);
// 			els.highestBidder.innerText = "Chưa có";
// 			els.minBidPrice.innerText = formatMoney(auction.min_bid_incr);
// 		}
// 	} catch (error) {
// 		console.error("Load Error:", error);
// 		alert("Lỗi tải dữ liệu phiên đấu giá.");
// 	}
// }

// // Hàm cập nhật UI khi có Bid mới (Từ Socket hoặc Load ban đầu)
// function updateUI(data, addToHistory = true) {
// 	// 1. Cập nhật Box thông tin chính
// 	els.currentPrice.innerText = formatMoney(data.amount);
// 	els.highestBidder.innerText = data.bidder_name;
// 	els.minBidPrice.innerText = minBidInr;

// 	// Hiệu ứng nhấp nháy
// 	els.currentPrice.style.color = "#e74c3c"; // Đổi màu đỏ
// 	setTimeout(() => (els.currentPrice.style.color = ""), 500); // Trả lại màu cũ

// 	// 2. Thêm vào danh sách lịch sử (Nếu cần)
// 	if (addToHistory) {
// 		// Nếu list đang có chữ "Chưa có...", xóa nó đi
// 		if (els.historyList.querySelector("p")) els.historyList.innerHTML = "";

// 		addHistoryCard(data.amount, data.bidder_name, data.time);
// 	}
// }

// // Hàm tạo thẻ HTML cho 1 dòng lịch sử (Giống design Buyer Screen.jpg)
// function addHistoryCard(amount, name, time) {
// 	const timeStr = new Date(time).toLocaleTimeString([], {
// 		hour: "2-digit",
// 		minute: "2-digit",
// 	});

// 	const html = `
//         <div class="history-card">
//             <div class="h-row"><strong>Người đấu giá:</strong> <span style="color:#00897b">${name}</span></div>
//             <div class="h-row"><strong>Giá:</strong> ${formatMoney(
// 							amount
// 						)}</div>
//             <div class="h-row"><strong>Thời gian:</strong> ${timeStr}</div>
//         </div>
//     `;

// 	// Chèn lên đầu danh sách
// 	els.historyList.insertAdjacentHTML("afterbegin", html);
// }

// function formatMoney(amount) {
// 	return new Intl.NumberFormat("vi-VN", {
// 		style: "currency",
// 		currency: "VND",
// 	}).format(amount);
// }

// // --- HÀM MỚI: Kiểm tra và Render Trạng thái ---
// function checkAuctionStatus(auctionData) {
// 	const now = new Date().getTime();
// 	const endTime = new Date(auctionData.auc_end_time).getTime();
// 	const bids = auctionData.Bid || [];

// 	if (now >= endTime) {
// 		// === TRẠNG THÁI: KẾT THÚC ===

// 		// 1. UI Badge
// 		els.statusBadge.innerText = "ĐÃ KẾT THÚC";
// 		els.statusBadge.className = "badge rounded-pill status-badge ended p-2";

// 		// 2. Ẩn Form đặt giá
// 		els.activeBidSection.style.display = "none";

// 		// 3. Hiện Người thắng (Nếu có bid)
// 		els.winnerSection.style.display = "block";

// 		if (bids.length > 0) {
// 			const winner = bids[0]; // Bid cao nhất
// 			els.winnerName.innerText = winner.Buyer?.User?.name || "Ẩn danh";
// 			els.winnerPrice.innerText = formatMoney(winner.bid_amount);
// 		} else {
// 			els.winnerName.innerText = "Không có người mua";
// 			els.winnerPrice.innerText = "";
// 		}

// 		els.countdownTimer.innerText = "00:00:00";
// 		els.countdownTimer.classList.add("text-muted");
// 	} else {
// 		// === TRẠNG THÁI: ĐANG DIỄN RA ===

// 		els.statusBadge.innerText = "ĐANG DIỄN RA";
// 		els.statusBadge.className = "badge rounded-pill status-badge active p-2";

// 		els.activeBidSection.style.display = "block";
// 		els.winnerSection.style.display = "none";
// 	}
// }

// // --- HÀM MỚI: Đếm ngược ---
// function startCountdown() {
// 	if (countdownInterval) clearInterval(countdownInterval);

// 	countdownInterval = setInterval(() => {
// 		const now = new Date().getTime();
// 		const distance = auctionEndTime - now;

// 		if (distance < 0) {
// 			clearInterval(countdownInterval);
// 			els.countdownTimer.innerText = "Đã kết thúc";
// 			// Reload lại trạng thái UI để ẩn form nếu người dùng đang treo máy
// 			// checkAuctionStatus(...) // Cần gọi lại logic ẩn form tại đây
// 			els.activeBidSection.style.display = "none";
// 			els.winnerSection.style.display = "block";
// 			return;
// 		}

// 		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
// 		const hours = Math.floor(
// 			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// 		);
// 		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
// 		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

// 		let timeStr = "";
// 		if (days > 0) timeStr += `${days}d `;
// 		timeStr += `${hours.toString().padStart(2, "0")}:${minutes
// 			.toString()
// 			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

// 		els.countdownTimer.innerText = timeStr;
// 	}, 1000);
// }

// // LẮNG NGHE SỰ KIỆN KẾT THÚC TỪ SERVER
// socket.on("auction_ended", (data) => {
// 	console.log("Kết thúc:", data);

// 	// 1. Dừng đếm ngược (nếu có)
// 	if (window.countdownInterval) clearInterval(window.countdownInterval);
// 	document.getElementById("countdown-timer").innerText = "ĐÃ KẾT THÚC";

// 	// 2. Ẩn form đặt giá
// 	const activeBidInfo = document.getElementById("active-bid-info"); // ID trong code cũ
// 	if (activeBidInfo) activeBidInfo.style.display = "none";

// 	// 3. Hiện thông báo người thắng
// 	// (Bạn cần thêm ID 'winner-section' vào HTML như hướng dẫn ở Turn #129)
// 	const winnerSection = document.getElementById("winner-section");
// 	if (winnerSection) {
// 		winnerSection.style.display = "block";
// 		document.getElementById("winner-name").innerText =
// 			data.winner || "Không có";

// 		if (data.success) {
// 			const price = new Intl.NumberFormat("vi-VN", {
// 				style: "currency",
// 				currency: "VND",
// 			}).format(data.price);
// 			document.getElementById("winner-final-price").innerText = price;
// 		}
// 	}

// 	alert(data.message);
// });
// js/scripts/auction.js
import auctionApi from "../services/auctionApi.js";
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

const socket = io("http://localhost:3000");

// 1. Lấy ID từ URL
const urlParams = new URLSearchParams(window.location.search);
const auctionId = urlParams.get("id");

// 2. Lấy các Element DOM
const els = {
	productName: document.getElementById("product-name"),
	productImage: document.getElementById("product-image"),
	productDesc: document.getElementById("product-desc"),
	sellerName: document.getElementById("seller-name"),
	productCode: document.getElementById("product-code"),
	location: document.getElementById("product-location"),
	auctionTime: document.getElementById("auction-time"),
	startPrice: document.getElementById("start-price"),
	stepPrice: document.getElementById("step-price"),

	currentPrice: document.getElementById("current-price"),
	highestBidder: document.getElementById("highest-bidder"),

	bidInput: document.getElementById("bid-input"),
	btnPlaceBid: document.getElementById("btn-place-bid"),
	historyList: document.getElementById("history-list"),

	statusBadge: document.getElementById("auction-status-badge"),
	countdownTimer: document.getElementById("countdown-timer"),

	// Khu vực đặt giá và khu vực người thắng
	activeBidSection: document.getElementById("active-bid-info"),
	winnerSection: document.getElementById("winner-section"),
	winnerName: document.getElementById("winner-name"),
	winnerPrice: document.getElementById("winner-final-price"),
	minBidPrice: document.getElementById("min-bid-price"),
};

// Biến toàn cục lưu thời gian
let auctionStartTime = null;
let auctionEndTime = null;
let countdownInterval = null;
let minBidInr = 0;
let currentAuctionStatus = ""; // "UPCOMING", "ACTIVE", "ENDED"

document.addEventListener("DOMContentLoaded", async () => {
	if (!auctionId) return;

	// Kết nối Socket
	socket.emit("join_auction", auctionId);
	console.log(`Joined room: auction_${auctionId}`);

	// Tải dữ liệu
	await loadAuctionData();

	// Lắng nghe sự kiện Real-time
	socket.on("new_bid", (data) => {
		console.log("New Bid Recieved:", data);
		updateUI(data);
	});
});

// Xử lý Đặt giá
els.btnPlaceBid.addEventListener("click", async () => {
	// Chặn nếu chưa bắt đầu (Client-side validation)
	if (currentAuctionStatus === "UPCOMING") {
		return alert("Phiên đấu giá chưa bắt đầu!");
	}

	const amount = els.bidInput.value;
	if (!amount) return alert("Vui lòng nhập số tiền!");

	els.btnPlaceBid.disabled = true;
	els.btnPlaceBid.innerText = "Đang xử lý...";

	try {
		await auctionApi.placeBid(auctionId, { bid_amount: Number(amount) });
		els.bidInput.value = "";
		// Không cần alert thành công vì socket sẽ tự cập nhật UI
	} catch (error) {
		console.error(error);
		// Hiển thị lỗi từ server trả về (ví dụ: chưa tới giờ, bước giá thấp...)
		const msg = error.response?.data?.message || "Không thể đặt giá";
		alert("Lỗi: " + msg);
		els.bidInput.value = "";
	} finally {
		els.btnPlaceBid.disabled = false;
		els.btnPlaceBid.innerText = "Xác nhận đặt giá";
	}
});

async function loadAuctionData() {
	try {
		const response = await auctionApi.getAuctionById(auctionId);
		const auction = response.data || response;

		if (!auction) throw new Error("No data");
		const product = auction.Product;

		// --- 1. LƯU THỜI GIAN ---
		auctionStartTime = new Date(auction.auc_start_time).getTime();
		auctionEndTime = new Date(auction.auc_end_time).getTime();
		minBidInr = formatMoney(auction.min_bid_incr);

		// --- 2. ĐIỀN DỮ LIỆU TĨNH ---
		els.productName.innerText = product.name;
		els.productDesc.innerText = product.description;
		els.sellerName.innerText = product.Seller?.User?.name || "Ẩn danh";
		els.productCode.innerText = `AUC-${product.ID}`;
		els.location.innerText = product.Seller?.User?.address || "Toàn quốc";

		const startStr = new Date(auction.auc_start_time).toLocaleString("vi-VN");
		const endStr = new Date(auction.auc_end_time).toLocaleString("vi-VN");
		els.auctionTime.innerText = `${startStr} - ${endStr}`;

		els.startPrice.innerText = formatMoney(auction.start_price);
		els.stepPrice.innerText = minBidInr;
		els.productImage.src = product.image
			? R2_PUBLIC_URL + product.image
			: "https://placehold.co/400";

		// --- 3. XỬ LÝ LỊCH SỬ & GIÁ ---
		const bids = auction.Bid || [];
		if (bids.length > 0) {
			const highestBid = bids[0];
			updateUI(
				{
					amount: highestBid.bid_amount,
					bidder_name: highestBid.Buyer?.User?.name || "Unknown",
					time: highestBid.bid_time,
				},
				false
			);

			els.historyList.innerHTML = "";
			bids.forEach((bid) => {
				addHistoryCard(bid.bid_amount, bid.Buyer?.User?.name, bid.bid_time);
			});
		} else {
			els.currentPrice.innerText = formatMoney(auction.start_price);
			els.highestBidder.innerText = "Chưa có";
			els.minBidPrice.innerText = minBidInr;
		}

		// --- 4. KIỂM TRA TRẠNG THÁI & BẮT ĐẦU ĐẾM NGƯỢC ---
		checkAuctionStatus(auction);
		startCountdown(); // Gọi hàm đếm ngược mới
	} catch (error) {
		console.error("Load Error:", error);
		els.productName.innerText = "Lỗi tải dữ liệu hoặc sản phẩm không tồn tại.";
	}
}

function updateUI(data, addToHistory = true) {
	els.currentPrice.innerText = formatMoney(data.amount);
	els.highestBidder.innerText = data.bidder_name;
	els.minBidPrice.innerText = minBidInr;

	els.currentPrice.style.color = "#d32f2f";
	setTimeout(() => (els.currentPrice.style.color = ""), 500);

	if (addToHistory) {
		if (els.historyList.querySelector("p")) els.historyList.innerHTML = "";
		addHistoryCard(data.amount, data.bidder_name, data.time);
	}
}

function addHistoryCard(amount, name, time) {
	const timeStr = new Date(time).toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
	const html = `
        <div class="history-card">
            <div class="h-row"><strong>Người đấu giá:</strong> <span style="color:#00897b">${name}</span></div>
            <div class="h-row"><strong>Giá:</strong> ${formatMoney(
							amount
						)}</div>
            <div class="h-row"><strong>Thời gian:</strong> ${timeStr}</div>
        </div>
    `;
	els.historyList.insertAdjacentHTML("afterbegin", html);
}

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}

// --- LOGIC MỚI: XỬ LÝ 3 TRẠNG THÁI ---
function checkAuctionStatus(auctionData) {
	const now = new Date().getTime();
	const bids = auctionData?.Bid || [];

	if (now < auctionStartTime) {
		// === TRƯỜNG HỢP 1: SẮP DIỄN RA (UPCOMING) ===
		currentAuctionStatus = "UPCOMING";

		// UI Badge
		els.statusBadge.innerText = "SẮP DIỄN RA";
		els.statusBadge.className = "badge rounded-pill bg-warning text-dark p-2";

		// Khóa chức năng đặt giá
		els.activeBidSection.style.display = "block"; // Vẫn hiện khung nhưng disable
		els.bidInput.disabled = true;
		els.bidInput.placeholder = "Chưa bắt đầu";
		els.btnPlaceBid.disabled = true;
		els.btnPlaceBid.innerText = "Chưa mở cửa";
		els.btnPlaceBid.classList.add("btn-secondary"); // Đổi màu xám

		els.winnerSection.style.display = "none";
	} else if (now >= auctionEndTime) {
		// === TRƯỜNG HỢP 2: ĐÃ KẾT THÚC (ENDED) ===
		currentAuctionStatus = "ENDED";

		els.statusBadge.innerText = "ĐÃ KẾT THÚC";
		els.statusBadge.className = "badge rounded-pill bg-secondary p-2";

		els.activeBidSection.style.display = "none";
		els.winnerSection.style.display = "block";

		if (bids.length > 0) {
			const winner = bids[0];
			els.winnerName.innerText = winner.Buyer?.User?.name || "Ẩn danh";
			els.winnerPrice.innerText = formatMoney(winner.bid_amount);
		} else {
			els.winnerName.innerText = "Không có người mua";
			els.winnerPrice.innerText = "---";
		}

		els.countdownTimer.innerText = "00:00:00";
	} else {
		// === TRƯỜNG HỢP 3: ĐANG DIỄN RA (ACTIVE) ===
		currentAuctionStatus = "ACTIVE";

		els.statusBadge.innerText = "ĐANG DIỄN RA";
		els.statusBadge.className = "badge rounded-pill bg-success p-2";

		// Mở khóa chức năng
		els.activeBidSection.style.display = "block";
		els.bidInput.disabled = false;
		els.bidInput.placeholder = "Nhập giá...";
		els.btnPlaceBid.disabled = false;
		els.btnPlaceBid.innerText = "Xác nhận đặt giá";
		els.btnPlaceBid.classList.remove("btn-secondary");

		els.winnerSection.style.display = "none";
	}
}

// --- LOGIC MỚI: Đếm ngược thông minh ---
function startCountdown() {
	if (countdownInterval) clearInterval(countdownInterval);

	const updateTimer = () => {
		const now = new Date().getTime();
		let targetTime = 0;
		let prefix = "";

		// Xác định mốc thời gian để đếm ngược
		if (currentAuctionStatus === "UPCOMING") {
			targetTime = auctionStartTime;
			prefix = "Mở sau: ";
			els.countdownTimer.style.color = "#ff9800"; // Màu cam

			// Tự động chuyển trạng thái khi đến giờ
			if (now >= auctionStartTime) {
				checkAuctionStatus({}); // Refresh lại trạng thái UI sang ACTIVE
				// (Lưu ý: Thực tế nên load lại data mới từ server để chắc chắn)
			}
		} else if (currentAuctionStatus === "ACTIVE") {
			targetTime = auctionEndTime;
			prefix = "Còn lại: ";
			els.countdownTimer.style.color = "#d32f2f"; // Màu đỏ
		} else {
			els.countdownTimer.innerText = "Đã kết thúc";
			return;
		}

		const distance = targetTime - now;

		if (distance < 0) {
			// Nếu hết giờ (của active) -> Kết thúc
			if (currentAuctionStatus === "ACTIVE") {
				checkAuctionStatus({ Bid: [] }); // Chuyển sang ENDED (Cần reload trang để lấy winner chuẩn)
				setTimeout(() => window.location.reload(), 2000); // Reload sau 2s
			}
			return;
		}

		// Format giờ
		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		let timeStr = prefix;
		if (days > 0) timeStr += `${days}d `;
		timeStr += `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

		els.countdownTimer.innerText = timeStr;
	};

	updateTimer(); // Chạy ngay lập tức
	countdownInterval = setInterval(updateTimer, 1000);
}

// SOCKET: Kết thúc
socket.on("auction_ended", (data) => {
	console.log("Kết thúc:", data);
	if (countdownInterval) clearInterval(countdownInterval);

	// Cập nhật ngay lập tức
	els.statusBadge.innerText = "ĐÃ KẾT THÚC";
	els.statusBadge.className = "badge rounded-pill bg-secondary p-2";
	els.activeBidSection.style.display = "none";
	els.winnerSection.style.display = "block";
	els.winnerName.innerText = data.winner || "Không có";
	if (data.success) {
		els.winnerPrice.innerText = formatMoney(data.price);
	}
	alert(data.message);
});
