module.exports = (io, socket) => {
	socket.on("join_auction", (auctionId) => {
		const roomName = `auction_${auctionId}`;
		socket.join(roomName);
		console.log(`Socket ${socket.id} joined room: ${roomName}`);
	});
	// socket.on("disconnect", () => {
	// 	console.log("Client disconnected, socket ID:", socket.id);
	// });
	socket.on("leave_auction", (auctionId) => {
		const roomName = `auction_${auctionId}`;
		socket.leave(roomName);
		console.log(`User ${socket.id} left Auction Room: ${roomName}`);
	});
};
