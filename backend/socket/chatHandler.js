const chatService = require("../services/ChatService");

module.exports = (io, socket) => {
	socket.on("send_message", async (data) => {
		try {
			const { conversationId, senderId, content, isBotChat, productId } = data;
			console.log(data);
			const roomName = `chat_${data.conversationId}`;

			await chatService.storeMessage(data);
			socket.to(roomName).emit("receive_message", data);
		} catch (err) {
			console.error("Chat error:", err);
			socket.emit("error", { message: "Không thể gửi tin nhắn" });
		}
	});
	socket.on("join_chat", (chatId) => {
		const roomName = `chat_${chatId}`;
		socket.join(roomName);
		console.log(`Socket ${socket.id} joined room: ${roomName}`);
	});
};
