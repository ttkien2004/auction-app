// routes/NotificationRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const NotifController = require("../controller/NotificationController"); // (Sửa lại đường dẫn controller nếu cần)

const routes = express.Router();

routes.get(
	"/notifications",
	authenticateToken,
	NotifController.getNotifications
);
routes.put(
	"/notifications/:id/read",
	authenticateToken,
	NotifController.markRead
);

module.exports = routes;
