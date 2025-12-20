// services/SellerService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProductForSeller = async (sellerId, productData) => {
	// TODO: Viết logic (ví dụ: prisma.product.create({ data: { ...productData, seller_id: sellerId } }))
	return { ...productData, seller_id: sellerId };
};

const getProductsBySeller = async (sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.product.findMany({ where: { seller_id: sellerId } }))
	return await prisma.product.findMany({
		where: {
			seller_ID: sellerId,
		},
		include: {
			DirectSale: {
				select: {
					buy_now_price: true,
				},
			},
			Auction: {
				select: {
					start_price: true,
					auc_start_time: true,
					auc_end_time: true,
					min_bid_incr: true,
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

const getReviewsForSeller = async (sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.review.findMany({ where: { reviewed_user_id: sellerId } }))
	return [];
};

const getTransactions = async (sellerId) => {
	return await prisma.transaction.findMany({
		where: {
			Product: {
				seller_ID: sellerId,
			},
		},
		include: {
			Product: {
				select: { ID: true, name: true, type: true, image: true },
			},
			// Lấy thông tin người mua (để Seller biết giao hàng cho ai)
			Buyer: {
				select: {
					User: {
						select: { name: true, address: true, phone_number: true },
					},
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
};
const createProduct = async (productData, sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.product.create({ data: productData }))
	console.log("Product type", productData);
	const {
		name,
		description,
		category_ID,
		pcondition,
		type,
		// DirectSale
		image,
		buy_now_price,
		// Auction
		start_price,
		min_bid_incr,
		auc_start_time,
		auc_end_time,
	} = productData;

	const createData = {
		name,
		description,
		pcondition,
		type,
		image,
		status: "active", // Mặc định là 'active' khi mới tạo
		seller_ID: sellerId,
		category_ID: parseInt(category_ID),
		// Chuẩn bị "tạo lồng nhau"
		DirectSale: undefined,
		Auction: undefined,
	};

	if (type === "DirectSale") {
		if (!buy_now_price)
			throw new Error("Thiếu 'buy_now_price' cho Bán trực tiếp");

		// "Tạo lồng nhau": Khi tạo Product, đồng thời tạo luôn DirectSale
		createData.DirectSale = {
			create: {
				buy_now_price: parseFloat(buy_now_price),
			},
		};
	} else if (type === "Auction") {
		if (!start_price || !auc_start_time || !auc_end_time) {
			throw new Error("Thiếu các trường bắt buộc cho Đấu giá");
		}

		// "Tạo lồng nhau": Khi tạo Product, đồng thời tạo luôn Auction
		createData.Auction = {
			create: {
				start_price: parseFloat(start_price),
				min_bid_incr: parseFloat(min_bid_incr) || 0,
				auc_start_time: new Date(auc_start_time), // Chuyển chuỗi ISO thành Date
				auc_end_time: new Date(auc_end_time),
			},
		};
	} else {
		throw new Error("Loại sản phẩm (type) không hợp lệ");
	}
	return prisma.product.create({
		data: createData,
		include: { DirectSale: true, Auction: true }, // Trả về data đầy đủ
	});
};

const updateProduct = async (productId, updateData, sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.product.update({ where: ..., data: updateData }))
	const product = await prisma.product.findUnique({
		where: { ID: productId },
	});
	console.log("product", product);
	if (!product) {
		throw new Error("Sản phẩm không tồn tại");
	}
	if (product.seller_ID !== sellerId) {
		throw new Error("Forbidden: Bạn không có quyền sửa sản phẩm này");
	}
	const {
		name,
		description,
		pcondition,
		status,
		buy_now_price, // for DirectSale
		start_price,
		min_bid_incr,
		auc_start_time,
		auc_end_time, // for Auction
	} = updateData;
	const updatePayload = {
		data: {
			name,
			description,
			pcondition,
			status,
			DirectSale: undefined,
			Auction: undefined,
		},
		include: { DirectSale: true, Auction: true },
	};
	if (product.type === "DirectSale" && buy_now_price !== undefined) {
		updatePayload.data.DirectSale = {
			update: {
				buy_now_price: parseFloat(buy_now_price),
			},
		};
	} else if (product.type === "Auction") {
		const auctionUpdateData = {};
		if (start_price !== undefined)
			auctionUpdateData.start_price = parseFloat(start_price);
		if (min_bid_incr !== undefined)
			auctionUpdateData.min_bid_incr = parseFloat(min_bid_incr);
		if (auc_start_time !== undefined)
			auctionUpdateData.auc_start_time = new Date(auc_start_time);
		if (auc_end_time !== undefined)
			auctionUpdateData.auc_end_time = new Date(auc_end_time);

		if (Object.keys(auctionUpdateData).length > 0) {
			updatePayload.data.Auction = {
				update: auctionUpdateData,
			};
		}
	}
	return prisma.product.update({
		where: { ID: productId },
		data: updatePayload.data,
		include: updatePayload.include,
	});
};

const deleteProduct = async (productId, sellerId) => {
	if (isNaN(productId)) {
		throw Error("Product's id not valid");
	}

	await prisma.$transaction(async (tx) => {
		// 1. LẤY SẢN PHẨM VÀ KIỂM TRA QUYỀN
		const product = await tx.product.findUnique({
			where: { ID: productId },
			select: { seller_ID: true },
		});

		if (!product) {
			throw new Error("Non-existed product");
		}

		if (product.seller_ID !== sellerId) {
			throw new Error("Forbidden to delete this product");
		}

		// 2. XÓA CÁC RÀNG BUỘC (DEPENDENCIES)

		// A. Xóa trong Giỏ hàng (CartItem) - RẤT QUAN TRỌNG
		// Nếu ai đó đang để sản phẩm này trong giỏ, phải xóa đi trước
		await tx.cartItem.deleteMany({
			where: { product_ID: productId },
		});

		// B. Xóa Review (Thông qua Transaction)
		const transactions = await tx.transaction.findMany({
			where: { product_ID: productId },
			select: { ID: true },
		});
		const transactionIds = transactions.map((t) => t.ID);

		if (transactionIds.length > 0) {
			await tx.review.deleteMany({
				where: { transaction_ID: { in: transactionIds } },
			});
		}

		// C. Xóa Transaction
		await tx.transaction.deleteMany({
			where: { product_ID: productId },
		});

		// D. Xóa Bid (Đấu giá)
		// Lưu ý: Kiểm tra xem bảng Bid dùng 'auction_ID' hay 'product_ID'
		// Nếu auction_ID chính là product_ID (quan hệ 1-1) thì code này đúng.
		// Nếu Auction là bảng riêng, cần lấy AuctionID trước.
		// Tuy nhiên, thường xóa theo product_ID nếu có quan hệ bắc cầu.
		// Ở đây giả sử bạn xóa theo Auction liên kết với Product.
		const auction = await tx.auction.findUnique({
			where: { product_ID: productId },
		});

		if (auction) {
			await tx.bid.deleteMany({
				where: { auction_ID: auction.ID }, // Hoặc product_ID tùy schema
			});
		}

		// E. Xóa thông tin chi tiết (DirectSale hoặc Auction)
		// Đây là nguyên nhân chính gây lỗi FK nếu chưa xóa
		await tx.directSale.deleteMany({
			where: { product_ID: productId },
		});

		await tx.auction.deleteMany({
			where: { product_ID: productId },
		});

		// F. Xóa Chat/Conversation (Nếu có tính năng chat theo sản phẩm)
		// await tx.conversation.deleteMany({ where: { product_ID: productId } });

		// 3. CUỐI CÙNG MỚI XÓA SẢN PHẨM
		await tx.product.delete({
			where: {
				ID: productId,
			},
		});
	});

	return { message: "Delete successfully" };
};

module.exports = {
	createProductForSeller,
	getProductsBySeller,
	getReviewsForSeller,
	getTransactions,
	updateProduct,
	deleteProduct,
};
