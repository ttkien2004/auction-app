// services/CartService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {number} userId - ID người mua
 * @param {number} productId - ID sản phẩm
 */
const addToCart = async (userId, productId) => {
	// 1. Kiểm tra sản phẩm có tồn tại và hợp lệ không
	const product = await prisma.product.findUnique({
		where: { ID: productId },
	});

	if (!product) {
		throw new Error("Sản phẩm không tồn tại");
	}

	// 2. Kiểm tra trạng thái (Chỉ được thêm hàng đang bán)
	if (product.status !== "active") {
		throw new Error("Sản phẩm này không còn khả dụng");
	}

	// 3. Kiểm tra loại (Chỉ DirectSale mới thêm vào giỏ được, Auction thì phải Bid)
	if (product.type !== "DirectSale") {
		throw new Error("Chỉ có thể thêm sản phẩm 'Mua Ngay' vào giỏ hàng");
	}

	// 4. Chặn tự mua hàng của mình
	if (product.seller_ID === userId) {
		throw new Error("Bạn không thể thêm sản phẩm của chính mình vào giỏ");
	}

	// 5. Kiểm tra xem đã có trong giỏ chưa
	const existingItem = await prisma.cartItem.findUnique({
		where: {
			buyer_ID_product_ID: {
				// Tên khóa phức hợp do Prisma tạo
				buyer_ID: userId,
				product_ID: productId,
			},
		},
	});

	if (existingItem) {
		throw new Error("Sản phẩm này đã có trong giỏ hàng của bạn");
	}

	// 6. Thêm vào giỏ (Tạo bản ghi CartItem)
	// Lưu ý: Phải đảm bảo user đó đã tồn tại trong bảng Buyer
	// Nếu chưa, bạn có thể cần logic tự động tạo Buyer (như đã bàn ở phần Auth)
	return prisma.cartItem.create({
		data: {
			buyer_ID: userId,
			product_ID: productId,
		},
		include: {
			Product: {
				select: { name: true, image: true },
			},
		},
	});
};

/**
 * Lấy danh sách giỏ hàng
 * @param {number} userId
 */
const getCart = async (userId) => {
	return prisma.cartItem.findMany({
		where: { buyer_ID: userId },
		include: {
			Product: {
				include: {
					DirectSale: { select: { buy_now_price: true } },
					Seller: {
						select: { User: { select: { name: true } } },
					},
				},
			},
		},
		orderBy: { added_at: "desc" },
	});
};

/**
 * Xóa khỏi giỏ hàng
 */
const removeFromCart = async (userId, productId) => {
	return prisma.cartItem.delete({
		where: {
			buyer_ID_product_ID: {
				buyer_ID: userId,
				product_ID: productId,
			},
		},
	});
};

module.exports = {
	addToCart,
	getCart,
	removeFromCart,
};
