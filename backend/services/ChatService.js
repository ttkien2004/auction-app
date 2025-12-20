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

	// 3. NẾU CHƯA TỒN TẠI
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

const getConversationByProduct = async (
	userId,
	productId,
	partnerId = null
) => {
	const product = await prisma.product.findUnique({
		where: { ID: productId },
	});

	if (!product) throw new Error("Sản phẩm không tồn tại");

	let buyerId;
	const sellerId = product.seller_ID;

	if (userId === sellerId) {
		if (!partnerId) {
			throw new Error("Bạn không thể nhắn tin với chính mình!");
		}
		buyerId = partnerId;
	} else {
		buyerId = userId;
	}

	// 2. Tìm xem đã có hội thoại chưa (Get)
	const conversation = await prisma.conversation.findFirst({
		where: {
			buyer_ID: buyerId,
			seller_ID: sellerId,
			product_ID: productId,
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
	if (!conversation) {
		const newConversation = await prisma.conversation.create({
			data: {
				// Các trường bắt buộc (Sửa lỗi "Buyer is missing")
				buyer_ID: buyerId,
				seller_ID: sellerId,
				product_ID: productId,
			},
		});
		return newConversation;
	}
	// conversation = await prisma.conversation.findFirst({
	// 	where: {
	// 		product_ID: productId,
	// 		OR: [{ buyer_ID: userId }, { seller_ID: userId }],
	// 	},
	// 	include: {
	// 		// Lấy danh sách tin nhắn cũ
	// 		Message: {
	// 			orderBy: { created_at: "asc" }, // Tin nhắn cũ xếp trước
	// 			include: {
	// 				Sender: { select: { name: true } }, // Lấy tên để hiển thị
	// 			},
	// 		},
	// 		// Lấy thông tin đối phương (để hiển thị tên trên header chat)
	// 		Seller: {
	// 			select: { username: true, ID: true, avatar: true },
	// 		},
	// 		Product: { select: { name: true } },
	// 		Buyer: { select: { username: true, ID: true, avatar: true } },
	// 	},
	// });

	return conversation;
};

const getUserConversations = async (userId) => {
	return prisma.conversation.findMany({
		where: {
			OR: [{ buyer_ID: userId }, { seller_ID: userId }],
		},
		include: {
			// Lấy tin nhắn cuối cùng để hiển thị preview
			Message: {
				orderBy: { created_at: "desc" },
				take: 1,
			},
			// Lấy thông tin các bên
			Buyer: { select: { ID: true, name: true, avatar: true } },
			Seller: { select: { ID: true, name: true, avatar: true } },
			Product: { select: { ID: true, name: true, image: true } }, // Lấy ảnh SP để dễ nhận biết
		},
		orderBy: {
			updated_at: "desc", // Hội thoại mới nhất lên đầu
		},
	});
};

const getConversationById = async (conversationId) => {
	return await prisma.conversation.findUnique({
		where: { ID: Number(conversationId) },
		include: {
			Message: { orderBy: { created_at: "asc" } },
			Buyer: { select: { ID: true, name: true, avatar: true } },
			Seller: { select: { ID: true, name: true, avatar: true } },
			Product: true,
		},
	});
};

const startConversation = async (
	currentUserId,
	productId,
	partnerId = null
) => {
	// 1. Lấy thông tin sản phẩm để biết ai là chủ (Seller)
	const product = await prisma.product.findUnique({
		where: { ID: productId },
	});

	if (!product) throw new Error("Sản phẩm không tồn tại");

	const ownerId = product.seller_ID;

	let buyerId, sellerId;

	// --- PHÂN ĐỊNH VAI TRÒ ---

	if (currentUserId === ownerId) {
		// TRƯỜNG HỢP 1: Người gọi là SELLER (Chủ sản phẩm)
		// Seller không thể "bắt đầu" hội thoại với hư không.
		// Họ chỉ có thể chat nếu biết Partner (Buyer) là ai.

		if (!partnerId) {
			// Nếu không biết chat với ai -> Đây là lỗi thao tác
			// (Ví dụ: Seller tự bấm nút Chat trên trang sản phẩm của mình)
			throw new Error(
				"Bạn là người bán. Vui lòng vào mục 'Tin nhắn' để trả lời khách hàng cụ thể."
			);
		}

		sellerId = currentUserId;
		buyerId = partnerId;
	} else {
		// TRƯỜNG HỢP 2: Người gọi là BUYER (Khách)
		// Đây là trường hợp phổ biến nhất
		buyerId = currentUserId;
		sellerId = ownerId;
	}

	// 2. Tìm xem đã có hội thoại chưa
	let conversation = await prisma.conversation.findFirst({
		where: {
			buyer_ID: buyerId,
			seller_ID: sellerId,
			product_ID: productId,
		},
		include: {
			Message: true,
			Buyer: { select: { name: true, ID: true, avatar: true } },
			Seller: { select: { name: true, ID: true, avatar: true } },
			Product: { select: { name: true, image: true } },
		},
	});

	// 3. Nếu chưa có -> Tạo mới
	if (!conversation) {
		conversation = await prisma.conversation.create({
			data: {
				buyer_ID: buyerId,
				seller_ID: sellerId,
				product_ID: productId,
			},
			include: {
				Buyer: { select: { name: true, ID: true } },
				Seller: { select: { name: true, ID: true } },
				Product: { select: { name: true } },
			},
		});
	}

	return conversation;
};

module.exports = {
	storeMessage,
	getConversationByProduct,
	getUserConversations,
	getConversationById,
	startConversation,
};
