require("dotenv").config(); // Tải biến .env lên đầu tiên
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.APP_PORT || 3000;
const cors = require("cors");

const http = require("http");

// Import routes
const authRoutes = require("./routes/AuthRoutes");
const auctionRoutes = require("./routes/AuctionRoutes");
const buyerRoutes = require("./routes/BuyerRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const directSalesRoutes = require("./routes/DirectSalesRoutes");
const productRoutes = require("./routes/ProductRoutes");
const reviewRoutes = require("./routes/ReviewRoutes");
const sellerRoutes = require("./routes/SellerRoutes");
const transRoutes = require("./routes/TransactionRoutes");
const userRoutes = require("./routes/UserRoutes");
const momoRoutes = require("./routes/MoMoRoutes");
const shippingRoutes = require("./routes/ShippingRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const cartRoutes = require("./routes/CartRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
//Socket
// const socket = require("./socket/socket");
const httpServer = http.createServer(app);

const socketManager = require("./socket/socket");
const socketEvents = require("./socket/index");
const io = socketManager.init(httpServer);
// Config swagger
const swaggerDocument = YAML.load("./openapi.yaml");

// Khởi tạo Cron
const cron = require("node-cron");
const AuctionService = require("./services/AuctionService");
// --- CRON JOB ---
// Chạy mỗi phút một lần (* * * * *)
cron.schedule("* * * * *", () => {
	AuctionService.processEndedAuctions().catch((err) => {
		console.error("Cron Job Error:", err);
	});
});

// Middleware để parse JSON
app.use(express.json());

// cors
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Route "Hello World"
app.get("/", (req, res) => {
	res.send("Chào mừng đến với API Sàn Đồ Cũ & Đấu Giá!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", auctionRoutes);
app.use("/api", buyerRoutes);
app.use("/api", categoryRoutes);
app.use("/api", directSalesRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api", sellerRoutes);
app.use("/api", transRoutes);
app.use("/api", userRoutes);
app.use("/api", cartRoutes);
app.use("/api", notificationRoutes);

app.use("/api/momo", momoRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/chat", chatRoutes);

// Lắng nghe kết nối từ client qua socket.io
socketEvents(io);

// Khởi động server
// app.listen(PORT, () => {
// 	console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
// });
httpServer.listen(PORT, () => {
	console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
