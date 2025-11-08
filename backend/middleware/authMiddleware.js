const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

	if (!token) {
		return res.status(401).json({ message: "Access token is missing" });
	}

	try {
		// Xác thực token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Gắn user vào request để route khác dùng
		req.user = decoded;

		next(); // Cho qua route tiếp theo
	} catch (err) {
		return res.status(403).json({ message: "Invalid or expired token" });
	}
};
module.exports = { authenticateToken };
