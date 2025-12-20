// routes/ChatRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const ChatController = require("../controller/ChatController");

const routes = express.Router();

// API: Lấy lịch sử chat theo sản phẩm
routes.get(
	"/conversations/product/:productId",
	authenticateToken,
	ChatController.getConversationByProductController
);

routes.get(
	"/conversations",
	authenticateToken,
	ChatController.getConversationsController
);

routes.get(
	"/conversations/:id",
	authenticateToken,
	ChatController.getConversationByIdController
);

routes.post(
	"/conversations/start",
	authenticateToken,
	ChatController.startChat
);

module.exports = routes;
