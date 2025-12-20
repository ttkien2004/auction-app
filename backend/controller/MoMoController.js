const MoMoService = require("../services/MoMoService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createMoMoTransaction = async (req, res, next) => {
	try {
		const { transactionId } = req.body;

		if (!transactionId) {
			return res.status(400).json({ message: "Missing transaction ID" });
		}
		const transaction = await prisma.transaction.findUnique({
			where: {
				ID: Number(transactionId),
			},
			include: {
				Product: true,
			},
		});
		if (!transaction) {
			return res.status(404).json({ message: "Not found transaction" });
		}
		const amount = transaction.final_amount;
		const orderInfo = `${transaction.Product.name}`;

		const body = await MoMoService.createMoMoTransaction(
			transactionId,
			amount,
			orderInfo
		);

		res.status(201).json({
			message: "created successfully",
			body: JSON.parse(body),
			result: JSON.parse(body).resultCode,
		});
	} catch (err) {
		next(err);
	}
};

const getResultFromTransaction = async (req, res, next) => {
	try {
		const result = await MoMoService.getMoMoTransactionResult(req, res);
		// await MoMoService.handleMoMoCallback(req.query);
		const { resultCode, orderId, message } = result;
		const transactionId = orderId.split("_")[1];
		if (resultCode === "0") {
			const frontendUrl = `http://127.0.0.1:5500/frontend/buy-list/index.html`;
			await prisma.transaction.update({
				where: {
					ID: Number(transactionId),
				},
				data: {
					status: "completed",
				},
			});
			return res.redirect(frontendUrl);
		} else {
			// --- THANH TOÁN THẤT BẠI ---

			await prisma.transaction.update({
				where: { ID: Number(transactionId) },
				data: { status: "failed" },
			});

			return res.redirect(
				`${frontendUrl}?status=failed&msg=${encodeURIComponent(message)}`
			);
		}

		// res.status(200).json({ message: "Handle transaction successfully" });
	} catch (err) {
		next(err);
	}
};

const callbackTransaction = async (req, res) => {
	try {
		// req.body chính là dữ liệu MoMo gửi sang
		console.log("🔍 Content-Type:", req.headers["content-type"]);
		console.log("🔍 Raw Body:", req.body);
		console.log("Receive Ipn from MoMo:", req.body);

		await MoMoService.handleMoMoCallback(req.body);

		// MoMo yêu cầu phản hồi 204 No Content để biết bạn đã nhận tin
		res.status(200).json({ message: "Handle transaction successfully" });
	} catch (error) {
		console.error("Lỗi xử lý IPN:", error);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createMoMoTransaction,
	getResultFromTransaction,
	callbackTransaction,
};
