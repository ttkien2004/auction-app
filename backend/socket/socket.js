// socket.js
const { Server } = require("socket.io");

let io;

module.exports = {
	init: (httpServer) => {
		io = new Server(httpServer, {
			cors: {
				origin: "*", // Hoặc cấu hình cụ thể domain frontend của bạn
				methods: ["GET", "POST"],
			},
		});
		return io;
	},
	getIO: () => {
		if (!io) {
			throw new Error("Socket.io not initialized!");
		}
		return io;
	},
};
