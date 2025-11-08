const { register, login, logout } = require("../service/AuthService");

const registerController = async (req, res) => {
	await register(req, res);
};

const loginController = async (req, res) => {
	await login(req, res);
};

const logoutController = async (req, res) => {
	await logout();
};

module.exports = {
	registerController,
	loginController,
	logoutController,
};
