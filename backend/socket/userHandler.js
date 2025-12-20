module.exports = (io, socket) => {
	socket.on("join_user_room", (userId) => {
		socket.join(`user_${userId}`);
		console.log(`Socket ${socket.id} joined user room ${userId}`);
	});
};
