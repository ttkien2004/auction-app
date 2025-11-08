const express = require("express");
const userController = require("../controller/UserController");
const { authenticateToken } = require("../middleware/authMiddleware");

const routes = express.Router();

routes.get("/users", authenticateToken, userController.getAllUsersController);
routes.get(
	"/users/{userId}",
	authenticateToken,
	userController.getUserByIdController
);
routes.put(
	"/users/{userId}",
	authenticateToken,
	userController.updateUserController
);
routes.delete(
	"/users/{userId}",
	authenticateToken,
	userController.deleteUserController
);
routes.get(
	"/users/{id}/bids",
	authenticateToken,
	userController.getUserBidsController
);

module.exports = routes;
