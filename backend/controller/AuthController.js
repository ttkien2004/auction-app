const { register, login, logout } = require("../services/AuthService");

const registerController = async (req, res) => {
	await register(req, res);
};

const loginController = async (req, res) => {
	await login(req, res);
};

const logoutController = async (req, res) => {
	await logout();
};

const sellerRegisterController = async (req, res) => {
	await register(req, res);
};

module.exports = {
	registerController,
	loginController,
	logoutController,
	sellerRegisterController,
};
