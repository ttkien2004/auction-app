import { BASE_URL } from "../services/apiHelpers.js";
import notifApi from "../services/notificationApi.js";

document.addEventListener("DOMContentLoaded", async () => {
	// ... các logic check login cũ ...

	await updateNotificationCount();
});

async function updateNotificationCount() {
	const user = localStorage.getItem("user");
	const badge = document.getElementById("count-notification");

	if (!user || !badge) return;

	try {
		// Giả sử bạn đã có API lấy danh sách thông báo
		// Hoặc API đếm số lượng chưa đọc: GET /notifications/unread-count
		const response = await notifApi.getNotifications();

		if (response) {
			const data = await response;
			// Lọc ra số tin chưa đọc
			const unreadCount = data.filter((n) => !n.is_read).length;

			if (unreadCount > 0) {
				badge.innerText = unreadCount > 99 ? "99+" : unreadCount;
				badge.style.display = "inline-block";
			} else {
				badge.style.display = "none"; // Ẩn nếu không có tin mới
			}
		}
	} catch (error) {
		console.error("Lỗi tải thông báo:", error);
	}
}
