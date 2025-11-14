// services/DirectSalesService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

const buyDirectSale = async (saleId, userId) => {
	// TODO: 1. Kiểm tra sản phẩm có tồn tại
	// TODO: 2. Tạo Transaction (logic cho service Transaction)
	return await prisma.$transaction(async (tx) => {
		const product = await tx.product.findUnique({
			where: { ID: saleId },
			include: {
				DirectSale: true, // Cần lấy giá
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

		const newTransaction = await tx.transaction.create({
			data: {
				buyer_ID: userId,
				product_ID: saleId,
				final_amount: product.DirectSale.buy_now_price,
				item_type: "DirectSale",
				status: "completed", // Bán trực tiếp có thể coi là 'completed' ngay
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
