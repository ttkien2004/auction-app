// services/R2Service.js
require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

// Khởi tạo S3 Client (kết nối tới Cloudflare R2)
const s3Client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	},
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;
const TARGET_FOLDER = "seller/assets";

/**
 * Upload file lên Cloudflare R2
 * @param {Object} file - File object từ Multer
 */
const uploadImage = async (file) => {
	try {
		// 1. Tạo tên file duy nhất
		const fileExtension = path.extname(file.originalname);
		const fileName = `${TARGET_FOLDER}/${file.originalname}`;

		// 2. Chuẩn bị lệnh upload
		const uploadParams = {
			Bucket: BUCKET_NAME,
			Key: fileName,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		// 3. Gửi lệnh lên R2
		await s3Client.send(new PutObjectCommand(uploadParams));

		// 4. Trả về tên file để lưu vào DB
		return fileName;
	} catch (error) {
		console.error("Lỗi upload R2:", error);
		throw new Error("Không thể upload ảnh lên Cloudflare");
	}
};

/**
 * Lấy URL đầy đủ để hiển thị ảnh
 */
const getImageUrl = (fileName) => {
	if (!fileName) return null;
	if (fileName.startsWith("http")) return fileName;

	// Ghép chuỗi public URL với tên file
	return `${PUBLIC_URL}/${fileName}`;
};

module.exports = {
	uploadImage,
	getImageUrl,
};
