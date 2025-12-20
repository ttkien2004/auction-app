// controllers/ChatController.js
const ChatService = require("../services/ChatService");

const getConversationByProductController = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const userId = req.user.id; // Lấy từ token

		if (!productId) {
			return res.status(400).json({ message: "Thiếu productId" });
		}

		const conversation = await ChatService.getConversationByProduct(
			Number(userId),
			Number(productId)
		);

		// Nếu chưa có hội thoại thì trả về null (để frontend biết là chat mới)
		res.status(200).json(conversation || null);
	} catch (error) {
		next(error);
	}
};

const getConversationsController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const conversations = await ChatService.getUserConversations(userId);
		res.status(200).json(conversations);
	} catch (error) {
		next(error);
	}
};

const getConversationByIdController = async (req, res, next) => {
	try {
		const { id } = req.params;
		// Gọi service lấy chi tiết (bạn có thể tái sử dụng hoặc viết hàm findUnique mới)
		const conversation = await ChatService.getConversationById(id);
		res.status(200).json(conversation);
	} catch (error) {
		next(error);
	}
};

const startChat = async (req, res, next) => {
	try {
		const userId = req.user.id;
		// Nhận thêm partnerId (nếu có)
		const { productId, partnerId } = req.body;

		const conversation = await ChatService.startConversation(
			userId,
			parseInt(productId),
			partnerId ? parseInt(partnerId) : null
		);

		res.status(200).json(conversation);
	} catch (error) {
		// Nếu lỗi là do Seller tự chat, trả về 400 Bad Request
		if (error.message.includes("Bạn là người bán")) {
			return res.status(400).json({ message: error.message });
		}
		next(error);
	}
};

module.exports = {
	getConversationByProductController,
	getConversationsController,
	getConversationByIdController,
	startChat,
};
