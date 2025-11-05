require("dotenv").config(); // Tải biến .env lên đầu tiên
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.APP_PORT || 3000;

// Middleware để parse JSON
app.use(express.json());

// Route "Hello World"
app.get("/", (req, res) => {
	res.send("Chào mừng đến với API Sàn Đồ Cũ & Đấu Giá!");
});

// === VÍ DỤ API ===
// GET: Lấy tất cả người dùng
app.get("/api/users", async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: "Không thể lấy danh sách người dùng" });
	}
});

// POST: Tạo người dùng mới
app.post("/api/users", async (req, res) => {
	try {
		const { username, email, full_name, password_hash } = req.body;
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				full_name,
				password_hash, // Lưu ý: Cần mã hóa mật khẩu trước khi lưu!
			},
		});
		res.status(201).json(newUser);
	} catch (error) {
		res
			.status(400)
			.json({ error: "Tạo người dùng thất bại", details: error.message });
	}
});

// Khởi động server
app.listen(PORT, () => {
	console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
