const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storeMessage = async (messageData) => {
	let { conversationId, senderId, content, isBotChat, productId } = messageData;

	// Chuyển đổi sang số nguyên để an toàn
	const id = parseInt(conversationId);
	const sId = parseInt(senderId);
	const pId = productId ? parseInt(productId) : null;

	// 2. Tìm cuộc hội thoại xem đã tồn tại chưa
	let conversation = await prisma.conversation.findUnique({
		where: { ID: id },
	});

	// 3. NẾU CHƯA TỒN TẠI -> TẠO MỚI (Đây là chỗ bạn đang vướng)
	if (!conversation) {
		// Bắt buộc phải có productId để biết ai là người bán
		if (!pId) {
			throw new Error("Cần productId để tạo cuộc hội thoại mới.");
		}

		// a. Tìm sản phẩm để lấy ID người bán
		const product = await prisma.product.findUnique({
			where: { ID: pId },
		});

		if (!product) {
			throw new Error("Sản phẩm không tồn tại.");
		}

		// b. Xác định vai trò
		const sellerId = product.seller_ID; // Chủ sản phẩm là Seller
		const buyerId = sId; // Người nhắn tin đầu tiên là Buyer

		// (Tùy chọn) Chặn tự nhắn tin cho chính mình
		if (sellerId === buyerId) {
			throw new Error("Bạn không thể tự nhắn tin cho chính mình.");
		}

		// c. Tạo Conversation với đầy đủ Buyer/Seller
		conversation = await prisma.conversation.create({
			data: {
				// Nếu bạn muốn tự set ID (như logic test hiện tại):
				ID: id,

				// Các trường bắt buộc (Sửa lỗi "Buyer is missing")
				buyer_ID: buyerId,
				seller_ID: sellerId,
				product_ID: pId,
			},
		});

		console.log(
			`Đã tạo hội thoại mới #${conversation.ID} giữa Buyer ${buyerId} và Seller ${sellerId}`
		);
	}

	// 4. Tạo tin nhắn (Message)
	const userMsg = await prisma.message.create({
		data: {
			conversation_ID: conversation.ID, // Dùng ID chuẩn từ biến conversation
			sender_ID: sId,
			content: content,
		},
		include: {
			Sender: { select: { name: true } },
		},
	});

	return userMsg;
};

const getConversationByProduct = async (userId, productId) => {
	const conversation = await prisma.conversation.findFirst({
		where: {
			product_ID: productId,
			OR: [{ buyer_ID: userId }, { seller_ID: userId }],
		},
		include: {
			// Lấy danh sách tin nhắn cũ
			Message: {
				orderBy: { created_at: "asc" }, // Tin nhắn cũ xếp trước
				include: {
					Sender: { select: { name: true } }, // Lấy tên để hiển thị
				},
			},
			// Lấy thông tin đối phương (để hiển thị tên trên header chat)
			Seller: {
				select: { username: true, ID: true, avatar: true },
			},
			Product: { select: { name: true } },
			Buyer: { select: { username: true, ID: true, avatar: true } },
		},
	});

	return conversation;
};

module.exports = {
	storeMessage,
	getConversationByProduct,
};
