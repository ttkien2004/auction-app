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

module.exports = { getConversationByProductController };
