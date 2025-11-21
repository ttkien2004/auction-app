// services/ProductService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getProducts = async (queryParams) => {
	// TODO: Viết logic (ví dụ: prisma.product.findMany({ where: queryParams }))
	if (Object.keys(queryParams).length !== 0) {
		const { limit: limitStr, offset: offsetStr, ...filters } = queryParams;

		const limit = parseInt(limitStr) || 10;
		const offset = parseInt(offsetStr) || 0;

		const where = {};

		const priceConditions = [];
		for (const key in filters) {
			const value = filters[key];

			// Bỏ qua nếu value rỗng (ví dụ: ?name=)
			if (!value) {
				continue;
			}

			// Dùng 'switch' để định nghĩa "luật" cho từng key
			switch (key) {
				case "name":
					// Luật: 'name' phải tìm kiếm 'contains'
					where.name = {
						contains: value,
						// mode: "insensitive",
					};
					break;

				case "categoryId":
					// Luật: 'categoryId' phải map sang 'category_ID' và là số
					where.category_ID = parseInt(value);
					break;

				case "status":
					// Luật: 'status' map trực tiếp
					where.status = value;
					break;

				case "condition": // Ví dụ: ?condition=new
					where.pcondition = value;
					break;

				case "type":
					where.type = value;
					break;

				case "minPrice":
					const minPrice = parseFloat(value);
					if (minPrice > 0) {
						priceConditions.push({
							OR: [
								{
									directSale: {
										buy_now_price: { gte: minPrice },
									},
								},
								{
									auction: {
										start_price: { gte: minPrice },
									},
								},
							],
						});
					}
					break;
				case "maxPrice":
					const maxPrice = parseFloat(value);
					if (maxPrice > 0) {
						priceConditions.push({
							OR: [
								{
									directSale: {
										buy_now_price: { lte: maxPrice },
									},
								},
								{
									auction: {
										start_price: { lte: maxPrice },
									},
								},
							],
						});
					}
					break;
			}
		}

		if (priceConditions.length > 0) {
			where.AND = priceConditions;
		}

		// --- 3. Lấy dữ liệu và Tổng số lượng (Total Count) ---
		const [products, totalCount] = await prisma.$transaction([
			prisma.product.findMany({
				where: where,
				skip: offset,
				take: limit,
				include: {
					Category: true,
					Seller: {
						select: {
							User: {
								select: {
									name: true,
									phone_number: true,
									ghn_district_id: true,
									ghn_ward_code: true,
								},
							},
						},
					},
					// (Bao gồm cả giá nếu bạn muốn)
					DirectSale: { select: { buy_now_price: true } },
					Auction: { select: { start_price: true } },
				},
				orderBy: {
					created_at: "desc",
				},
			}),

			prisma.product.count({
				where: where, // <== Đếm với cùng bộ lọc
			}),
		]);

		// --- 4. Trả về kết quả ---
		return {
			data: products,
			pagination: {
				total: totalCount,
				limit: limit,
				offset: offset,
				totalPages: Math.ceil(totalCount / limit),
			},
		};
	}
	return prisma.product.findMany();
};

const getProductById = async (productId) => {
	// TODO: Viết logic (ví dụ: prisma.product.findUnique({ where: { product_id: productId } }))
	const product = await prisma.product.findUnique({
		where: { ID: productId },
		include: {
			Category: true,
			Seller: {
				select: {
					user_ID: true,
					User: { select: { name: true, email: true, phone_number: true } },
				},
			},
			DirectSale: true,
			Auction: true,
		},
	});

	if (!product) {
		throw new Error("Sản phẩm không tồn tại");
	}
	return product;
};

const createProduct = async (productData, sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.product.create({ data: productData }))
	const {
		name,
		description,
		category_ID,
		pcondition,
		type,
		// DirectSale
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
	// TODO: Viết logic (ví dụ: prisma.product.delete({ where: ... }))
	if (isNaN(productId)) {
		throw Error("Product's id not valid");
	}
	await prisma.$transaction(async (tx) => {
		// 1. LẤY SẢN PHẨM VÀ KIỂM TRA QUYỀN
		const product = await tx.product.findUnique({
			where: { ID: productId },
			select: { seller_ID: true }, // Chỉ cần ID người bán để check quyền
		});

		if (!product) {
			throw new Error("Non-existed product");
		}

		// (BẮT BUỘC) Kiểm tra xem người xóa có phải là chủ sở hữu không
		if (product.seller_ID !== sellerId) {
			throw new Error("Forbidden to delete this product");
		}

		// 2.
		// Tìm các Transaction liên quan đến Product
		const transactions = await tx.transaction.findMany({
			where: { product_ID: productId },
			select: { ID: true },
		});
		const transactionIds = transactions.map((t) => t.ID);

		// Xóa Review (cháu)
		if (transactionIds.length > 0) {
			await tx.review.deleteMany({
				where: { transaction_ID: { in: transactionIds } },
			});
		}

		// 3. XÓA "CON" (Transaction, Bid)

		// Xóa Transaction
		await tx.transaction.deleteMany({
			where: { product_ID: productId },
		});

		// Xóa Bid (auction_ID của Bid = product_ID của Auction, theo schema của bạn)
		await tx.bid.deleteMany({
			where: { auction_ID: productId },
		});

		await tx.product.delete({
			where: {
				ID: productId,
			},
		});
	});
	return { message: "Delete successfully" };
};

module.exports = {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
