require("dotenv").config(); // Tải biến .env lên đầu tiên
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.APP_PORT || 3000;
const cors = require("cors");

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
// Config swagger
const swaggerDocument = YAML.load("./openapi.yaml");

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

// Khởi động server
app.listen(PORT, () => {
	console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
