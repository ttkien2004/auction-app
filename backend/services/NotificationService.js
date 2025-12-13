// services/NotificationService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const socketManager = require("../socket/socket"); // Để bắn socket

/**
 * Tạo và Gửi thông báo
 * @param {number} userId - Người nhận
 * @param {object} data - { type, title, message, link }
 */
const createNotification = async (userId, data) => {
	const { type, title, message, link } = data;

	// 1. Lưu vào DB
	const notification = await prisma.notification.create({
		data: {
			user_ID: userId,
			type,
			title,
			message,
			link,
		},
	});

	// 2. Bắn Socket Real-time (Nếu user đang online)
	try {
		const io = socketManager.getIO();
		// Bắn vào room riêng của User (User phải join room này khi login)
		io.to(`user_${userId}`).emit("new_notification", notification);
	} catch (error) {
		console.error("Socket error:", error.message);
	}

	return notification;
};

/**
 * Lấy danh sách thông báo của User
 */
const getUserNotifications = async (userId) => {
	return prisma.notification.findMany({
		where: { user_ID: userId },
		orderBy: { created_at: "desc" },
		take: 50, // Giới hạn 50 tin mới nhất
	});
};

/**
 * Đánh dấu đã đọc
 */
const markAsRead = async (userId, notificationId) => {
	// Nếu notificationId = 'all' -> Đánh dấu tất cả
	if (notificationId === "all") {
		return prisma.notification.updateMany({
			where: { user_ID: userId, is_read: false },
			data: { is_read: true },
		});
	}

	return prisma.notification.update({
		where: { ID: Number(notificationId), user_ID: userId },
		data: { is_read: true },
	});
};

module.exports = {
	createNotification,
	getUserNotifications,
	markAsRead,
};
