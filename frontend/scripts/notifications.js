// Dữ liệu giả lập (Sau này sẽ gọi API)
const mockNotifications = [
	{
		id: 1,
		type: "auction",
		title: "Chúc mừng! Bạn đã thắng đấu giá",
		message:
			"Bạn đã thắng sản phẩm 'Laptop Gaming XYZ' với giá 10.500.000đ. Vui lòng thanh toán trong vòng 24h.",
		time: "Vừa xong",
		isRead: false,
		link: "../html/buy-list.html",
	},
	{
		id: 2,
		type: "order",
		title: "Đơn hàng đang được giao",
		message:
			"Đơn hàng #10023 (Tai nghe Bluetooth) đã được giao cho đơn vị vận chuyển GHN.",
		time: "2 giờ trước",
		isRead: false,
		link: "../html/buy-list.html",
	},
	{
		id: 3,
		type: "system",
		title: "Khuyến mãi đặc biệt tháng 11",
		message: "Nhập mã GREEN11 để giảm 10% phí vận chuyển cho mọi đơn hàng.",
		time: "1 ngày trước",
		isRead: true,
		link: "#",
	},
	{
		id: 4,
		type: "auction",
		title: "Bạn đã bị vượt giá!",
		message:
			"Người dùng @binhtran vừa đặt giá cao hơn cho sản phẩm 'Đồng hồ cổ'. Hãy đặt lại ngay!",
		time: "2 ngày trước",
		isRead: true,
		link: "../html/auction/detail.html?id=3",
	},
	{
		id: 5,
		type: "order",
		title: "Giao hàng thành công",
		message:
			"Đơn hàng #9988 đã giao thành công. Hãy đánh giá sản phẩm để nhận điểm thưởng.",
		time: "3 ngày trước",
		isRead: true,
		link: "../html/reviews.html",
	},
];

const listContainer = document.getElementById("notification-list");
const filters = document.querySelectorAll(".filter-item");
const btnMarkAll = document.getElementById("btn-mark-all-read");

document.addEventListener("DOMContentLoaded", () => {
	renderNotifications(mockNotifications);
});

// Xử lý bộ lọc
filters.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		// UI Active
		filters.forEach((b) => b.classList.remove("active"));
		e.currentTarget.classList.add("active"); // Dùng currentTarget để lấy đúng nút button

		const type = e.currentTarget.dataset.type;
		let filteredData = mockNotifications;

		if (type === "unread") {
			filteredData = mockNotifications.filter((n) => !n.isRead);
		} else if (type !== "all") {
			filteredData = mockNotifications.filter((n) => n.type === type);
		}

		renderNotifications(filteredData);
	});
});

// Xử lý Đánh dấu tất cả đã đọc
btnMarkAll.addEventListener("click", () => {
	mockNotifications.forEach((n) => (n.isRead = true));

	// Render lại theo tab hiện tại
	const currentFilter = document.querySelector(".filter-item.active").dataset
		.type;
	let data = mockNotifications;
	if (currentFilter === "unread") data = [];
	else if (currentFilter !== "all")
		data = mockNotifications.filter((n) => n.type === currentFilter);

	renderNotifications(data);

	// Cập nhật badge số lượng (về 0)
	const badge = document.querySelector(".badge.bg-danger");
	if (badge) badge.style.display = "none";
});

function renderNotifications(data) {
	if (data.length === 0) {
		listContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="far fa-bell-slash fa-3x text-muted mb-3"></i>
                <p class="text-muted">Không có thông báo nào.</p>
            </div>
        `;
		return;
	}

	const html = data
		.map((item) => {
			// Xác định icon theo loại
			let iconClass = "fa-bell";
			let bgClass = "icon-system";
			if (item.type === "order") {
				iconClass = "fa-box";
				bgClass = "icon-order";
			}
			if (item.type === "auction") {
				iconClass = "fa-gavel";
				bgClass = "icon-auction";
			}

			const unreadClass = item.isRead ? "" : "unread";

			return `
        <div class="notif-item ${unreadClass}" onclick="window.location.href='${
				item.link
			}'">
            <div class="notif-icon-box ${bgClass}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="notif-content">
                <div class="d-flex justify-content-between">
                    <h6 class="notif-title">${item.title}</h6>
                    <span class="notif-time">${item.time}</span>
                </div>
                <p class="notif-desc">${item.message}</p>
            </div>
            ${
							!item.isRead
								? '<i class="fas fa-circle text-teal small ms-2 align-self-center"></i>'
								: ""
						}
        </div>
        `;
		})
		.join("");

	listContainer.innerHTML = html;
}
