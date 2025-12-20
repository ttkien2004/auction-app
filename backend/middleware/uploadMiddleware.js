const multer = require("multer");

// --- QUAN TRỌNG: Dùng memoryStorage thay vì diskStorage ---
// Lý do: Chúng ta không muốn lưu rác vào ổ cứng server.
// Chúng ta muốn giữ file trong RAM để R2Service đẩy thẳng lên Cloud.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Chỉ cho phép upload file ảnh!"), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
