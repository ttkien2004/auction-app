// controllers/NotificationController.js
const NotificationService = require("../services/NotificationService");

const getNotifications = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const notifs = await NotificationService.getUserNotifications(userId);
		res.status(200).json(notifs);
	} catch (error) {
		next(error);
	}
};

const markRead = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { id } = req.params; // ID thông báo hoặc 'all'
		await NotificationService.markAsRead(userId, id);
		res.status(200).json({ message: "Updated" });
	} catch (error) {
		next(error);
	}
};

module.exports = { getNotifications, markRead };
