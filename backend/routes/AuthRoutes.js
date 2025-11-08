const express = require("express");
const {
	registerController,
	loginController,
	logoutController,
} = require("../controller/AuthController");

const routes = express.Router();

routes.post("/sign-up", registerController);

routes.post("/sign-in", loginController);

routes.post("/log-out", logoutController);

module.exports = routes;
