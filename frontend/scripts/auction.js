// TODO: Dùng file này cho việc gọi đến các Api services
// import auctionApi from "../services/auctionApi";
import auctionApi from "../services/auctionApi.js";

const socket = io("http://localhost:3000");
const urlParams = new URLSearchParams(window.location.search);
const auctionId = urlParams.get("id");

const currentPriceEl = document.getElementById("current-price-container");
const historyBody = document.getElementById("bid-history-body");
const btnPlaceBid = document.getElementById("btn-place-bid");
const inputBid = document.getElementById("bid-amount");

document.addEventListener("DOMContentLoaded", async () => {
	if (!auctionId) {
		alert("Không tìm thấy ID phiên đấu giá");
		return;
	}

	// --- BƯỚC 1: JOIN ROOM SOCKET ---
	// Gửi sự kiện để server biết mình đang xem phiên này
	socket.emit("join_auction", auctionId);
	console.log(`Đã join room auction_${auctionId}`);

	// --- BƯỚC 2: LẤY DỮ LIỆU BAN ĐẦU (API) ---
	await loadInitialData();

	// --- BƯỚC 3: LẮNG NGHE SỰ KIỆN 'NEW_BID' TỪ SERVER ---
	socket.on("new_bid", (data) => {
		console.log("⚡ Có người đặt giá mới:", data);

		// Cập nhật giao diện NGAY LẬP TỨC
		updateUI(data);
	});
});

// Xử lý đặt giá
btnPlaceBid.addEventListener("click", async () => {
	const amount = inputBid.value;

	if (!amount) return alert("Vui lòng nhập số tiền");

	// Disable nút để tránh click đúp
	btnPlaceBid.disabled = true;
	btnPlaceBid.innerText = "Đang xử lý...";

	try {
		// Gọi API POST /api/auctions/{id}/bids
		// (Lưu ý: Không dùng socket.emit để đặt giá, mà dùng API để bảo mật)
		const response = await auctionApi.placeBid(auctionId, {
			bid_amount: Number(amount),
		});

		alert("Đặt giá thành công!");
		inputBid.value = "";
	} catch (error) {
		alert("Lỗi: " + (error.message || "Không thể đặt giá"));
	} finally {
		btnPlaceBid.disabled = false;
		btnPlaceBid.innerText = "Đặt Giá Ngay";
	}
});

async function loadInitialData() {
	try {
		// Lấy thông tin chi tiết phiên đấu giá
		const auction = await auctionApi.getAuctionById(auctionId);

		// Fill thông tin sản phẩm (Tiêu đề, ảnh, mô tả...)
		console.log(auction);
		document.getElementById("product-name").innerText = auction.Product.name;
		document.getElementById("seller-name").innerText =
			auction.Product.Seller.User.name;
		document.getElementById("min-step").innerText = formatMoney(
			auction.min_bid_incr
		);

		// Lấy danh sách Bid lịch sử
		const bids = auction.Bid; // (Giả sử API trả về include Bid)

		// Nếu có bid, lấy giá cao nhất hiện tại
		if (bids && bids.length > 0) {
			const highestBid = bids[0]; // Đã sort desc
			updateUI({
				amount: highestBid.bid_amount,
				bidder_name: highestBid.Buyer.User.name,
				time: highestBid.bid_time,
			});

			// Render lại toàn bộ bảng lịch sử
			bids.forEach((bid) =>
				addHistoryRow(bid.bid_amount, bid.Buyer.User.name, bid.bid_time)
			);
		} else {
			// Chưa có ai đặt, hiện giá khởi điểm
			currentPriceEl.innerText = formatMoney(auction.start_price);
		}
	} catch (error) {
		console.error(error);
	}
}

function updateUI(data) {
	// 1. Cập nhật giá to bự
	currentPriceEl.innerText = formatMoney(data.amount);

	// 2. Cập nhật tên người giữ giá
	document.getElementById("highest-bidder").innerText = data.bidder_name;

	// 3. Thêm hiệu ứng nhấp nháy (Visual feedback)
	currentPriceEl.classList.remove("price-update");
	void currentPriceEl.offsetWidth; // Trigger reflow
	currentPriceEl.classList.add("price-update");

	// 4. Thêm vào bảng lịch sử (thêm lên đầu)
	addHistoryRow(data.amount, data.bidder_name, data.time);
}

function addHistoryRow(amount, name, time) {
	const row = `
        <tr>
            <td>${name}</td>
            <td class="text-success fw-bold">${formatMoney(amount)}</td>
            <td class="text-muted small">${new Date(
							time
						).toLocaleTimeString()}</td>
        </tr>
    `;
	// Chèn vào dòng đầu tiên của bảng
	historyBody.insertAdjacentHTML("afterbegin", row);
}

function formatMoney(number) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(number);
}
