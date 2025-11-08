require("dotenv").config(); // Tải biến .env lên đầu tiên
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.APP_PORT || 3000;

// Import routes
const authRoutes = require("./routes/AuthRoutes");
// Config swagger
const swaggerDocument = YAML.load("./openapi.yaml");

// Middleware để parse JSON
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Route "Hello World"
app.get("/", (req, res) => {
	res.send("Chào mừng đến với API Sàn Đồ Cũ & Đấu Giá!");
});

// Routes
app.use("/auth", authRoutes);

// Khởi động server
app.listen(PORT, () => {
	console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
