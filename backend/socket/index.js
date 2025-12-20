const auctionHandler = require("./auctionHandler");
const chatHandler = require("./chatHandler");
const userHandler = require("./userHandler");

const onConnection = (io) => {
	io.on("connection", (socket) => {
		console.log(`Client connected: ${socket.id}`);

		auctionHandler(io, socket);
		chatHandler(io, socket);
		userHandler(io, socket);

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});
};

module.exports = onConnection;
