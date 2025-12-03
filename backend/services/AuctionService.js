// services/AuctionService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const socket = require("../socket/socket");

const getAuctions = async (query) => {
	if (Object.keys(query).length !== 0) {
		const { auctionId } = query;
		return await getAuctionById(Number(auctionId));
	}
	return await getAllAuctions();
};
const getAllAuctions = async () => {
	// TODO: Viết logic (ví dụ: prisma.auction.findMany())
	return prisma.auction.findMany({
		where: {
			// Chỉ lấy các phiên đấu giá đang diễn ra
			auc_start_time: { lte: new Date() }, // Đã bắt đầu
			auc_end_time: { gte: new Date() }, // Chưa kết thúc
			Product: {
				status: "active", // Và sản phẩm đang 'active'
			},
		},
		include: {
			Product: {
				// Lấy thông tin sản phẩm
				include: {
					Seller: {
						// Lấy thông tin người bán
						select: {
							user_ID: true,
							User: { select: { name: true } },
						},
					},
				},
			},
		},
		orderBy: {
			auc_end_time: "asc", // Ưu tiên các phiên sắp hết hạn
		},
	});
};

const getAuctionById = async (auctionId) => {
	// TODO: Viết logic (ví dụ: prisma.auction.findUnique({ where: ... }))
	const auction = await prisma.auction.findUnique({
		where: { product_ID: auctionId },
		include: {
			Product: {
				// Thông tin sản phẩm
				include: {
					Category: true,
					Seller: {
						select: {
							user_ID: true,
							User: { select: { name: true, email: true } },
						},
					},
				},
			},
			Bid: {
				// Lấy tất cả các lượt bid
				orderBy: {
					bid_amount: "desc", // Sắp xếp giá cao nhất lên đầu
				},
				include: {
					Buyer: {
						// Lấy thông tin người đặt giá
						select: { User: { select: { name: true } } },
					},
				},
			},
		},
	});

	if (!auction) {
		throw new Error("Không tìm thấy phiên đấu giá");
	}
	return auction;
};

const createAuction = async (productId, auctionData) => {
	// TODO: Viết logic (ví dụ: tạo auction cho 1 product_id)
	const { start_price, min_bid_incr, auc_start_time, auc_end_time } =
		auctionData;

	// Kiểm tra xem sản phẩm có tồn tại không
	const product = await prisma.product.findUnique({ where: { ID: productId } });
	if (!product) {
		throw new Error("Non-existed product");
	}

	return prisma.auction.create({
		data: {
			product_ID: productId,
			start_price: parseFloat(start_price),
			min_bid_incr: parseFloat(min_bid_incr) || 0,
			auc_start_time: new Date(auc_start_time),
			auc_end_time: new Date(auc_end_time),
		},
	});
};

const updateAuction = async (auctionId, updateData, userId) => {
	// TODO: Viết logic (ví dụ: prisma.auction.update({ where: ..., data: ... }))
	const auction = await prisma.auction.findUnique({
		where: { product_ID: auctionId },
		include: { Product: true },
	});

	if (!auction) {
		throw new Error("Not found auction");
	}
	if (auction.Product.seller_ID !== userId) {
		throw new Error("Forbidden to access this service");
	}

	return prisma.auction.update({
		where: { product_ID: auctionId },
		data: {
			start_price: updateData.start_price
				? parseFloat(updateData.start_price)
				: undefined,
			min_bid_incr: updateData.min_bid_incr
				? parseFloat(updateData.min_bid_incr)
				: undefined,
			auc_start_time: updateData.auc_start_time
				? new Date(updateData.auc_start_time)
				: undefined,
			auc_end_time: updateData.auc_end_time
				? new Date(updateData.auc_end_time)
				: undefined,
		},
	});
};

const deleteAuction = async (auctionId, userId) => {
	// TODO: Viết logic (ví dụ: prisma.auction.delete({ where: ... }))
	return await prisma.$transaction(async (tx) => {
		const auction = await tx.auction.findUnique({
			where: { product_ID: auctionId },
			include: { Product: true },
		});

		if (!auction) {
			throw new Error("Not found auction");
		}
		if (auction.Product.seller_ID !== userId) {
			throw new Error("Forbidden to access this service");
		}
		await tx.bid.deleteMany({
			where: { auction_ID: auctionId },
		});
		await tx.auction.delete({
			where: { product_ID: auctionId },
		});
		return { message: "Delete auction successfully" };
	});
};

const joinAuction = async (auctionId, userId) => {
	// TODO: Viết logic (ví dụ: tạo watchlist)
	const existing = await prisma.watchlist.findUnique({
		where: {
			user_ID_product_ID: {
				// (Tên khóa phức hợp @@id)
				user_ID: userId,
				product_ID: auctionId,
			},
		},
	});
	if (existing) {
		return { message: "You're following this auction" };
	}

	await prisma.watchlist.create({
		data: {
			user_ID: userId,
			product_ID: auctionId, // auctionId chính là product_ID
		},
	});
	return { message: "Joining Auction successfully" };
};

const getBidsForAuction = async (auctionId) => {
	// TODO: Viết logic (ví dụ: prisma.bid.findMany({ where: { auction_product_id: auctionId } }))
	return await prisma.bid.findMany({
		where: {
			auction_ID: auctionId,
		},
		include: {
			Buyer: {
				select: {
					User: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
};

const placeBid = async (auctionId, userId, bidData) => {
	// TODO: 1. Kiểm tra bid_amount có hợp lệ
	const { bid_amount } = bidData;
	const amount = parseFloat(bid_amount);

	if (isNaN(amount) || amount <= 0) {
		throw new Error("Your amount is not valid");
	}
	return await prisma.$transaction(async (tx) => {
		// TODO 2. Kiểm tra auction hợp lệ không
		const auction = await tx.auction.findUnique({
			where: { product_ID: auctionId },
			include: { Product: true },
		});
		if (!auction) throw new Error("Non-existed auction");
		if (auction.Product.seller_ID === userId) {
			throw new Error("You cannot set bid amount by yourself");
		}
		if (new Date() < auction.auc_start_time) {
			throw new Error("This auction has not started yet");
		}
		if (new Date() > auction.auc_end_time) {
			throw new Error("Phiên đấu giá này đã kết thúc");
		}
		const highestBid = await tx.bid.findFirst({
			where: { auction_ID: auctionId },
			orderBy: { bid_amount: "desc" },
		});
		let minRequiredBid;

		if (highestBid) {
			// Nếu đã có người bid
			if (highestBid.buyer_ID === userId) {
				throw new Error("Bạn đang là người giữ giá cao nhất");
			}
			const currentPrice = parseFloat(highestBid.bid_amount);
			const step = parseFloat(auction.min_bid_incr) || 0;
			minRequiredBid = parseFloat(currentPrice + step);
		} else {
			// Nếu là người bid đầu tiên
			minRequiredBid = auction.start_price;
		}
		if (amount < minRequiredBid) {
			throw new Error(`You have to set bid at least ${minRequiredBid}`);
		}
		// TODO: 3. Tạo bid (ví dụ: prisma.bid.create({ data: ... }))
		const newBid = await tx.bid.create({
			data: {
				bid_amount: amount,
				buyer_ID: userId,
				auction_ID: auctionId,
				// bid_time là default CURRENT_TIMESTAMP
			},
			include: {
				Buyer: {
					select: {
						User: {
							select: {
								name: true, // Lấy tên để hiển thị socket
							},
						},
					},
				},
			},
		});
		// Phát sự kiện Socket.io cho các client đang theo dõi auction này
		try {
			const io = socket.getIO();
			// Bắn sự kiện 'new_bid' vào phòng 'auction_{id}'
			// Tất cả client đang xem auction này sẽ nhận được
			io.to(`auction_${auctionId}`).emit("new_bid", {
				bid_id: newBid.ID,
				amount: newBid.bid_amount,
				bidder_name: newBid.Buyer.User.name,
				time: newBid.bid_time,
			});
		} catch (err) {
			console.error("Lỗi khi phát sự kiện Socket.io:", err);
		}
		return newBid;
	});
};

/**
 * Hàm này sẽ được gọi mỗi phút bởi Cron Job
 */
const processEndedAuctions = async () => {
	console.log("--- Checking for ended auctions ---");

	const now = new Date();

	// 1. Tìm các phiên đấu giá ĐÃ HẾT HẠN nhưng trạng thái vẫn là 'active'
	// (Dựa vào Product.status để biết trạng thái)
	const endedAuctions = await prisma.auction.findMany({
		where: {
			auc_end_time: { lte: now }, // Thời gian kết thúc <= Hiện tại
			Product: {
				status: "active", // Vẫn đang mở
			},
		},
		include: {
			Product: true,
			Bid: {
				orderBy: { bid_amount: "desc" }, // Lấy giá cao nhất
				take: 1,
				include: {
					Buyer: { include: { User: true } }, // Lấy thông tin người thắng
				},
			},
		},
	});

	if (endedAuctions.length === 0) return;

	// 2. Xử lý từng phiên
	for (const auction of endedAuctions) {
		await endAuction(auction);
	}
};

/**
 * Xử lý logic kết thúc cho 1 phiên
 */
const endAuction = async (auction) => {
	const productId = auction.product_ID;
	const winnerBid = auction.Bid[0]; // Bid cao nhất (có thể undefined nếu ko ai đặt)

	await prisma.$transaction(async (tx) => {
		// A. Cập nhật trạng thái sản phẩm -> 'sold' (hoặc 'ended' nếu ko ai mua)
		// Để tránh Cron job quét lại lần nữa
		const newStatus = winnerBid ? "sold" : "expired";

		await tx.product.update({
			where: { ID: productId },
			data: { status: newStatus },
		});

		// B. Nếu có người thắng -> TẠO ĐƠN HÀNG TỰ ĐỘNG
		if (winnerBid) {
			console.log(`Auction #${productId} won by Buyer #${winnerBid.buyer_ID}`);

			await tx.transaction.create({
				data: {
					buyer_ID: winnerBid.buyer_ID,
					product_ID: productId,
					final_amount: winnerBid.bid_amount,
					item_type: "Auction",
					status: "pending_payment", // Chờ người thắng vào thanh toán
					// Các trường ship sẽ null, chờ người dùng cập nhật sau
				},
			});
		} else {
			console.log(`Auction #${productId} ended with no bids.`);
		}
	});

	// C. GỬI THÔNG BÁO SOCKET (Real-time)
	// Bắn sự kiện tới tất cả người đang xem phiên đấu giá này
	const io = socket.getIO();
	const roomName = `auction_${productId}`;

	if (winnerBid) {
		io.to(roomName).emit("auction_ended", {
			message: "Phiên đấu giá đã kết thúc!",
			winner: winnerBid.Buyer.User.name,
			price: winnerBid.bid_amount,
			success: true,
		});
	} else {
		io.to(roomName).emit("auction_ended", {
			message: "Phiên đấu giá đã kết thúc (Không có người mua).",
			success: false,
		});
	}
};

module.exports = {
	getAuctions,
	getAllAuctions,
	getAuctionById,
	createAuction,
	updateAuction,
	deleteAuction,
	joinAuction,
	getBidsForAuction,
	placeBid,
	//Service mới
	processEndedAuctions,
};
