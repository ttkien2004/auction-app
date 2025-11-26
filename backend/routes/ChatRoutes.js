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

module.exports = routes;
