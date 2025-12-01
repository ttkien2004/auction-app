// // TODO: Dùng file này cho việc gọi đến các Api services
// // import auctionApi from "../services/auctionApi";
// import auctionApi from "../services/auctionApi.js";

// const socket = io("http://localhost:3000");
// const urlParams = new URLSearchParams(window.location.search);
// const auctionId = urlParams.get("id");

// const currentPriceEl = document.getElementById("current-price-container");
// const historyBody = document.getElementById("bid-history-body");
// const btnPlaceBid = document.getElementById("btn-place-bid");
// const inputBid = document.getElementById("bid-amount");

// document.addEventListener("DOMContentLoaded", async () => {
// 	if (!auctionId) {
// 		alert("Không tìm thấy ID phiên đấu giá");
// 		return;
// 	}

// 	// --- BƯỚC 1: JOIN ROOM SOCKET ---
// 	// Gửi sự kiện để server biết mình đang xem phiên này
// 	socket.emit("join_auction", auctionId);
// 	console.log(`Đã join room auction_${auctionId}`);

// 	// --- BƯỚC 2: LẤY DỮ LIỆU BAN ĐẦU (API) ---
// 	await loadInitialData();

// 	// --- BƯỚC 3: LẮNG NGHE SỰ KIỆN 'NEW_BID' TỪ SERVER ---
// 	socket.on("new_bid", (data) => {
// 		console.log("⚡ Có người đặt giá mới:", data);

// 		// Cập nhật giao diện NGAY LẬP TỨC
// 		updateUI(data);
// 	});
// });

// // Xử lý đặt giá
// btnPlaceBid.addEventListener("click", async () => {
// 	const amount = inputBid.value;

// 	if (!amount) return alert("Vui lòng nhập số tiền");

// 	// Disable nút để tránh click đúp
// 	btnPlaceBid.disabled = true;
// 	btnPlaceBid.innerText = "Đang xử lý...";

// 	try {
// 		// Gọi API POST /api/auctions/{id}/bids
// 		// (Lưu ý: Không dùng socket.emit để đặt giá, mà dùng API để bảo mật)
// 		const response = await auctionApi.placeBid(auctionId, {
// 			bid_amount: Number(amount),
// 		});

// 		alert("Đặt giá thành công!");
// 		inputBid.value = "";
// 	} catch (error) {
// 		alert("Lỗi: " + (error.message || "Không thể đặt giá"));
// 	} finally {
// 		btnPlaceBid.disabled = false;
// 		btnPlaceBid.innerText = "Đặt Giá Ngay";
// 	}
// });

// async function loadInitialData() {
// 	try {
// 		// Lấy thông tin chi tiết phiên đấu giá
// 		const auction = await auctionApi.getAuctionById(auctionId);

// 		// Fill thông tin sản phẩm (Tiêu đề, ảnh, mô tả...)
// 		console.log(auction);
// 		document.getElementById("product-name").innerText = auction.Product.name;
// 		document.getElementById("seller-name").innerText =
// 			auction.Product.Seller.User.name;
// 		document.getElementById("min-step").innerText = formatMoney(
// 			auction.min_bid_incr
// 		);

// 		// Lấy danh sách Bid lịch sử
// 		const bids = auction.Bid; // (Giả sử API trả về include Bid)

// 		// Nếu có bid, lấy giá cao nhất hiện tại
// 		if (bids && bids.length > 0) {
// 			const highestBid = bids[0]; // Đã sort desc
// 			updateUI({
// 				amount: highestBid.bid_amount,
// 				bidder_name: highestBid.Buyer.User.name,
// 				time: highestBid.bid_time,
// 			});

// 			// Render lại toàn bộ bảng lịch sử
// 			bids.forEach((bid) =>
// 				addHistoryRow(bid.bid_amount, bid.Buyer.User.name, bid.bid_time)
// 			);
// 		} else {
// 			// Chưa có ai đặt, hiện giá khởi điểm
// 			currentPriceEl.innerText = formatMoney(auction.start_price);
// 		}
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// function updateUI(data) {
// 	// 1. Cập nhật giá to bự
// 	currentPriceEl.innerText = formatMoney(data.amount);

// 	// 2. Cập nhật tên người giữ giá
// 	document.getElementById("highest-bidder").innerText = data.bidder_name;

// 	// 3. Thêm hiệu ứng nhấp nháy (Visual feedback)
// 	currentPriceEl.classList.remove("price-update");
// 	void currentPriceEl.offsetWidth; // Trigger reflow
// 	currentPriceEl.classList.add("price-update");

// 	// 4. Thêm vào bảng lịch sử (thêm lên đầu)
// 	addHistoryRow(data.amount, data.bidder_name, data.time);
// }

// function addHistoryRow(amount, name, time) {
// 	const row = `
//         <tr>
//             <td>${name}</td>
//             <td class="text-success fw-bold">${formatMoney(amount)}</td>
//             <td class="text-muted small">${new Date(
// 							time
// 						).toLocaleTimeString()}</td>
//         </tr>
//     `;
// 	// Chèn vào dòng đầu tiên của bảng
// 	historyBody.insertAdjacentHTML("afterbegin", row);
// }

// function formatMoney(number) {
// 	return new Intl.NumberFormat("vi-VN", {
// 		style: "currency",
// 		currency: "VND",
// 	}).format(number);
// }
import auctionApi from "../services/auctionApi.js";
// (Nếu bạn có apiHelpers để format tiền thì import, không thì dùng hàm dưới)
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

const socket = io("http://localhost:3000");

// 1. Lấy ID từ URL (Ví dụ: auction.html?id=5)
const urlParams = new URLSearchParams(window.location.search);
const auctionId = urlParams.get("id");

// 2. Lấy các Element từ DOM (theo ID mới trong HTML)
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
};

document.addEventListener("DOMContentLoaded", async () => {
	if (!auctionId) {
		console.log(auctionId);
		// alert("Không tìm thấy ID phiên đấu giá. Quay lại trang chủ.");
		// window.location.href = "../index.html";
		console.log(urlParams);
		return;
	}

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
	const amount = els.bidInput.value;
	if (!amount) return alert("Vui lòng nhập số tiền!");

	els.btnPlaceBid.disabled = true;
	els.btnPlaceBid.innerText = "Đang xử lý...";

	try {
		// Gọi API
		await auctionApi.placeBid(auctionId, { bid_amount: Number(amount) });

		// Reset input (Giao diện sẽ tự update nhờ socket)
		els.bidInput.value = "";
		alert("Đặt giá thành công!");
	} catch (error) {
		console.error(error);
		alert("Lỗi: " + (error.message || "Không thể đặt giá"));
	} finally {
		els.btnPlaceBid.disabled = false;
		els.btnPlaceBid.innerText = "Xác nhận";
	}
});

async function loadAuctionData() {
	try {
		const response = await auctionApi.getAuctionById(auctionId);
		const auction = response.data || response; // Tùy cấu trúc trả về

		if (!auction) throw new Error("No data");

		const product = auction.Product;

		// --- ĐIỀN DỮ LIỆU VÀO HTML ---
		els.productName.innerText = product.name;
		els.productDesc.innerText = product.description;
		els.sellerName.innerText = product.Seller?.User?.name || "Ẩn danh";
		els.productCode.innerText = `AUC-${product.ID}`; // Tạo mã giả hoặc dùng ID
		els.location.innerText = product.Seller?.User?.address || "Toàn quốc";

		// Format thời gian
		const start = new Date(auction.auc_start_time).toLocaleString();
		const end = new Date(auction.auc_end_time).toLocaleString();
		els.auctionTime.innerText = `${start} - ${end}`;

		els.startPrice.innerText = formatMoney(auction.start_price);
		els.stepPrice.innerText = formatMoney(auction.min_bid_incr);

		// Xử lý ảnh (Nếu có URL ảnh từ Cloudflare/Firebase)
		els.productImage.src =
			R2_PUBLIC_URL + product.image || "https://placehold.co/400";

		// --- XỬ LÝ LỊCH SỬ & GIÁ HIỆN TẠI ---
		const bids = auction.Bid || [];

		if (bids.length > 0) {
			const highestBid = bids[0]; // Giả sử API trả về sort desc

			// Cập nhật giá & người thắng
			updateUI(
				{
					amount: highestBid.bid_amount,
					bidder_name: highestBid.Buyer?.User?.name || "Unknown",
					time: highestBid.bid_time,
				},
				false
			); // false để không thêm trùng history

			// Render toàn bộ list lịch sử
			els.historyList.innerHTML = ""; // Xóa text "chưa có giá"
			bids.forEach((bid) => {
				addHistoryCard(bid.bid_amount, bid.Buyer?.User?.name, bid.bid_time);
			});
		} else {
			// Chưa có ai đặt
			els.currentPrice.innerText = formatMoney(auction.start_price);
			els.highestBidder.innerText = "Chưa có";
		}
	} catch (error) {
		console.error("Load Error:", error);
		alert("Lỗi tải dữ liệu phiên đấu giá.");
	}
}

// Hàm cập nhật UI khi có Bid mới (Từ Socket hoặc Load ban đầu)
function updateUI(data, addToHistory = true) {
	// 1. Cập nhật Box thông tin chính
	els.currentPrice.innerText = formatMoney(data.amount);
	els.highestBidder.innerText = data.bidder_name;

	// Hiệu ứng nhấp nháy
	els.currentPrice.style.color = "#e74c3c"; // Đổi màu đỏ
	setTimeout(() => (els.currentPrice.style.color = ""), 500); // Trả lại màu cũ

	// 2. Thêm vào danh sách lịch sử (Nếu cần)
	if (addToHistory) {
		// Nếu list đang có chữ "Chưa có...", xóa nó đi
		if (els.historyList.querySelector("p")) els.historyList.innerHTML = "";

		addHistoryCard(data.amount, data.bidder_name, data.time);
	}
}

// Hàm tạo thẻ HTML cho 1 dòng lịch sử (Giống design Buyer Screen.jpg)
function addHistoryCard(amount, name, time) {
	const timeStr = new Date(time).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
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

	// Chèn lên đầu danh sách
	els.historyList.insertAdjacentHTML("afterbegin", html);
}

function formatMoney(amount) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}
