// services/MoMoService.js
const https = require("https");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createMoMoTransaction = (transactionId, amountInput, orderInfoInput) => {
	// --- Bọc toàn bộ logic trong một Promise ---
	return new Promise((resolve, reject) => {
		// (Toàn bộ code 'var' của bạn ở đây)
		var accessKey = "F8BBA842ECF85";
		var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
		var orderInfo = "pay with MoMo";
		var partnerCode = "MOMO";
		var redirectUrl = "http://localhost:3000/api/momo/result";
		var ipnUrl = "http://localhost:3000/api/momo/result";
		var requestType = "payWithMethod";
		// var amount = "50000";
		// var orderId = partnerCode + new Date().getTime();
		// var requestId = orderId;
		var extraData = "";
		// var paymentCode =
		// 	"T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
		var orderGroupId = "";
		var autoCapture = true;
		var lang = "vi";

		//  Lấy thông tin thanh toán từ transaction
		var amount = amountInput.toString();
		var orderInfo = orderInfoInput || "Paying Transaction" + transactionId;
		var orderId =
			partnerCode + "_" + transactionId + "_" + new Date().getTime();
		var requestId = orderId;

		var rawSignature =
			"accessKey=" +
			accessKey +
			"&amount=" +
			amount +
			"&extraData=" +
			extraData +
			"&ipnUrl=" +
			ipnUrl +
			"&orderId=" +
			orderId +
			"&orderInfo=" +
			orderInfo +
			"&partnerCode=" +
			partnerCode +
			"&redirectUrl=" +
			redirectUrl +
			"&requestId=" +
			requestId +
			"&requestType=" +
			requestType;

		console.log("--------------------RAW SIGNATURE----------------");
		console.log(rawSignature);

		var signature = crypto
			.createHmac("sha256", secretKey)
			.update(rawSignature)
			.digest("hex");
		console.log("--------------------SIGNATURE----------------");
		console.log(signature);

		const requestBody = JSON.stringify({
			partnerCode: partnerCode,
			partnerName: "Test",
			storeId: "MomoTestStore",
			requestId: requestId,
			amount: amount,
			orderId: orderId,
			orderInfo: orderInfo,
			redirectUrl: redirectUrl,
			ipnUrl: ipnUrl,
			lang: lang,
			requestType: requestType,
			autoCapture: autoCapture,
			extraData: extraData,
			orderGroupId: orderGroupId,
			signature: signature,
		});

		const options = {
			hostname: "test-payment.momo.vn",
			port: 443,
			path: "/v2/gateway/api/create",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(requestBody),
			},
		};

		//Send the request and get the response
		const req2 = https.request(options, (res2) => {
			console.log(`Status: ${res2.statusCode}`);

			// Tạo một biến để "gom" dữ liệu trả về
			let responseBody = "";

			res2.setEncoding("utf8");
			res2.on("data", (chunk) => {
				// 'data' có thể chạy nhiều lần, nên ta nối chuỗi
				responseBody += chunk;
			});

			res2.on("end", () => {
				console.log("No more data in response.");
				// Khi kết thúc, 'resolve' Promise với chuỗi JSON
				resolve(responseBody);
			});
		});

		req2.on("error", (e) => {
			console.log(`problem with request: ${e.message}`);
			// Nếu lỗi, 'reject' Promise
			reject(e);
		});

		// **QUAN TRỌNG: GỬI REQUEST ĐI**
		console.log("Sending....");
		req2.write(requestBody);
		req2.end();
	}); // <-- Đóng Promise
};

const handleMoMoCallback = async (ipnData) => {
	const {
		partnerCode,
		orderId,
		requestId,
		amount,
		orderInfo,
		orderType,
		transId,
		resultCode,
		message,
		payType,
		responseTime,
		extraData,
		signature, // Chữ ký MoMo gửi kèm
	} = ipnData;
	var accessKey = "F8BBA842ECF85";
	var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
	const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
	const generatedSignature = crypto
		.createHmac("sha256", secretKey)
		.update(rawSignature)
		.digest("hex");

	if (signature !== generatedSignature) {
		throw new Error("Invalid Signature");
	}
	if (resultCode == 0) {
		// 3. Lấy Transaction ID từ orderId
		// Format orderId của bạn lúc tạo là: MOMO_TRANSACTIONID_TIMESTAMP
		// Ví dụ: MOMO_15_1719999999
		const parts = orderId.split("_");
		const transactionId = parts[1]; // Lấy phần giữa (ID là 15)

		if (!transactionId) {
			throw new Error("Not found transaction");
		}

		// 4. Cập nhật Database
		await prisma.transaction.update({
			where: { ID: parseInt(transactionId) },
			data: {
				status: "completed", // Đã thanh toán xong
				// Có thể lưu thêm transId của MoMo nếu muốn
			},
		});

		console.log(`Updated #${transactionId} successfully!`);
	} else {
		console.log("Failed to handle transaction.");
		// Bạn có thể cập nhật status = 'failed' nếu muốn
	}
};

const getMoMoTransactionResult = (req, res) => {
	return req.query;
};

module.exports = {
	createMoMoTransaction,
	getMoMoTransactionResult,
	handleMoMoCallback,
};
