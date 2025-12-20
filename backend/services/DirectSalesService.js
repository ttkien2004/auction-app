// services/DirectSalesService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Shippingservice = require("./ShippingService");

const getAllDirectSales = async () => {
	// TODO: Viết logic (ví dụ: prisma.directSale.findMany())
	return await prisma.product.findMany({
		where: {
			type: "DirectSale",
			status: "active",
		},
		include: {
			DirectSale: {
				select: {
					buy_now_price: true,
				},
			},
			Seller: {
				select: {
					User: {
						select: {
							ID: true,
							username: true,
							name: true,
						},
					},
				},
			},
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

const getDirectSaleById = async (saleId) => {
	// TODO: Viết logic (ví dụ: prisma.directSale.findUnique({ where: ... }))
	const product = await prisma.product.findUnique({
		where: { ID: saleId },
		include: {
			DirectSale: true,
			Category: true,
			Seller: {
				select: {
					user_ID: true,
					User: { select: { name: true, email: true } },
				},
			},
		},
	});

	// Đảm bảo đây đúng là sản phẩm DirectSale
	if (!product || !product.DirectSale) {
		throw new Error("Non-existed product");
	}
	return product;
};

const createDirectSale = async (saleData, sellerId) => {
	// TODO: Viết logic (ví dụ: prisma.directSale.create({ data: ... }))
	const { name, description, category_ID, pcondition, buy_now_price } =
		saleData;
	if (!buy_now_price) {
		throw new Error("Missing price for this product");
	}
	return await prisma.product.create({
		data: {
			name,
			description,
			pcondition,
			type: "DirectSale", // Ghi đè/set type
			status: "active",
			seller_ID: sellerId,
			category_ID: parseInt(category_ID),
			DirectSale: {
				create: {
					buy_now_price: parseFloat(buy_now_price),
				},
			},
		},
		include: {
			DirectSale: true, // Trả về data đầy đủ
		},
	});
};

const buyDirectSale = async (saleId, userId, shippingData) => {
	// TODO: 1. Kiểm tra sản phẩm có tồn tại
	// TODO: 2. Tạo Transaction (logic cho service Transaction)
	// tính toán ngày giao hàng dự kiến
	// const estimatedDate = new Date();
	// estimatedDate.setDate(estimatedDate.getDate() + 5);
	return await prisma.$transaction(async (tx) => {
		const existingTransaction = await tx.transaction.findFirst({
			where: {
				product_ID: saleId,
				buyer_ID: userId,
				status: "pending_payment", // Chỉ lấy đơn chưa thanh toán
			},
		});

		if (existingTransaction) {
			// Cập nhật lại địa chỉ (phòng khi user sửa địa chỉ ở lần nhấn thứ 2)
			const updatedTrans = await tx.transaction.update({
				where: { ID: existingTransaction.ID },
				data: {
					shipping_address: shippingData.address,
					shipping_phone: shippingData.phone,
					shipping_note: shippingData.note,
					shipping_province_id: shippingData.to_province_id,
					shipping_district_id: shippingData.to_district_id,
					shipping_ward_code: shippingData.to_ward_code,
					// Không cần tính lại ngày giao hàng hoặc giá tiền
				},
			});

			// Trả về transaction cũ để Controller tiếp tục gọi MoMo
			return updatedTrans;
		}

		const buyer = await tx.user.findUnique({
			where: {
				ID: userId,
			},
		});
		if (!buyer.ghn_district_id) {
			await tx.user.update({
				where: { ID: userId },
				data: {
					// Lưu thông tin địa chính GHN
					ghn_province_id: shippingData.to_province_id,
					ghn_district_id: shippingData.to_district_id,
					ghn_ward_code: shippingData.to_ward_code,

					// Lưu địa chỉ hiển thị và SĐT
					address: shippingData.address,
					phone_number: shippingData.phone,
				},
			});
		}

		const product = await tx.product.findUnique({
			where: { ID: saleId },
			include: {
				DirectSale: true, // Cần lấy giá
				Seller: {
					include: {
						User: {
							select: { ghn_district_id: true }, // Lấy ID kho người bán
						},
					},
				},
			},
		});
		if (!product || !product.DirectSale) {
			throw new Error("Non-existed product");
		}
		if (product.status !== "active") {
			throw new Error("This product has been sold");
		}
		if (product.seller_ID === userId) {
			throw new Error("You cannot buy it by yourself");
		}
		await tx.product.update({
			where: { ID: saleId },
			data: { status: "sold" },
		});
		const sellerDistrictId = product.Seller.User.ghn_district_id;
		if (!sellerDistrictId) {
			throw new Error("Seller's GHN district ID is not set");
		}

		const estimatedDate = await Shippingservice.calculateExpectedDelivery(
			sellerDistrictId,
			shippingData.to_district_id,
			shippingData.to_ward_code
		);
		const productPrice = Number(product.DirectSale.buy_now_price);
		const shipFee = Number(shippingData.shipping_fee || 0);
		const finalAmount = productPrice + shipFee;

		const newTransaction = await tx.transaction.create({
			data: {
				buyer_ID: userId,
				product_ID: saleId,
				final_amount: finalAmount,
				item_type: "DirectSale",
				status: "pending_payment", // Bán trực tiếp có thể coi là 'completed' ngay
				shipping_address: shippingData.address,
				shipping_phone: shippingData.phone,
				shipping_note: shippingData.note,

				// Lưu thông tin giao hàng chi tiết
				shipping_province_id: shippingData.to_province_id,
				shipping_district_id: shippingData.to_district_id,
				shipping_ward_code: shippingData.to_ward_code,
				expected_delivery_date: estimatedDate,
			},
		});

		// Xóa đơn hàng khỏi giỏ hàng
		await tx.cartItem.deleteMany({
			where: {
				buyer_ID: userId,
				product_ID: saleId,
			},
		});

		return newTransaction;
	});
};

const updateDirectSale = async (saleId, updateData) => {
	// TODO: Viết logic (ví dụ: prisma.directSale.update({ where: ..., data: ... }))
	return { id: saleId, ...updateData };
};

const deleteDirectSale = async (saleId, userId) => {
	// TODO: Viết logic (ví dụ: prisma.directSale.delete({ where: ... }))
	// return await prisma.$transaction(async (tx) => {
	// 	const product = await tx.product.findUnique({
	// 		where: { ID: saleId },
	// 	});

	// 	if (!product) {throw new Error("Non-existed product")};
	// 	if (product.seller_ID !== userId)
	// 		{throw new Error("Forbidden to access this service")};
	// 	if (product.type !== "DirectSale")
	// 		{throw new Error("Wrong type of product")};

	// });
	return { message: "Nothing" };
};

module.exports = {
	getAllDirectSales,
	getDirectSaleById,
	createDirectSale,
	buyDirectSale,
	updateDirectSale,
	deleteDirectSale,
};
