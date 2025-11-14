// controllers/UserController.js
const UserService = require("../services/UserService");

const getAllUsersController = async (req, res, next) => {
	try {
		const queryParams = req.query;
		const users = await UserService.getUsers(queryParams);
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

const getUserByIdController = async (req, res, next) => {
	try {
		const { userId } = req.params;
		console.log(userId);
		const user = await UserService.getUserById(Number(userId));
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

const updateUserController = async (req, res, next) => {
	try {
		// const { userId } = req.params;
		const updateData = req.body;
		const updatedUser = await UserService.updateUser(
			Number(req.user.id),
			updateData
		);
		res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
};

const deleteUserController = async (req, res, next) => {
	try {
		const { userId } = req.params;
		await UserService.deleteUser(Number(userId));
		res.status(204).send(); // 204 No Content
	} catch (error) {
		next(error);
	}
};

const getUserBidsController = async (req, res, next) => {
	try {
		const { id } = req.params; // Lưu ý: route của bạn dùng {id}
		const bids = await UserService.getUserBids(Number(id));
		res.status(200).json(bids);
	} catch (error) {
		next(error);
	}
};

const getUserProfileController = async (req, res, next) => {
	try {
		// const { id, username, email } = req.user;
		const profile = await UserService.getUserById(parseInt(req.user.id));
		res.status(200).json({ message: "hello", profile });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllUsersController,
	getUserByIdController,
	updateUserController,
	deleteUserController,
	getUserBidsController,
	getUserProfileController,
};
