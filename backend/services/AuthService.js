const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword } = require("../utils/hash.js");
const { generateToken } = require("../utils/jwt.js");
const prisma = new PrismaClient();

const register = async (req, res) => {
	try {
		const { username, email, password, name } = req.body;

		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});

		if (existingUser)
			return res.status(400).json({ message: "User already exists" });

		const hashed = await hashPassword(password);

		const user = await prisma.user.create({
			data: { username, email, password: hashed, name },
		});

		const token = generateToken(user);

		res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				username: user.username,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user)
			return res.status(400).json({ message: "Invalid email or password" });

		const valid = await comparePassword(password, user.password);

		if (!valid)
			return res.status(400).json({ message: "Invalid email or password" });

		const token = generateToken(user);

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				fname: user.fname,
				lname: user.lname,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const logout = async () => {
	res.status(200).json({ message: "Logout successfully" });
};

module.exports = {
	login,
	register,
	logout,
};
