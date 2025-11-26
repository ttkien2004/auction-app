const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword } = require("../utils/hash.js");
const { generateToken } = require("../utils/jwt.js");
const prisma = new PrismaClient();

const register = async (req, res) => {
	try {
		const { username, email, password, name, roles } = req.body;

		let defaultRole = "BUYER";
		// console.log(roles);
		if (roles.length !== 0) {
			if (roles.includes("SELLER")) {
				defaultRole = "SELLER";
			}
		}

		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});

		if (existingUser)
			return res.status(400).json({ message: "User already exists" });

		const hashed = await hashPassword(password);

		const newUser = await prisma.$transaction(async (tx) => {
			// a. Tạo User
			const user = await tx.user.create({
				data: {
					email,
					username,
					name,
					password: hashed,
				},
			});

			// b. Tự động tạo Buyer (liên kết với User vừa tạo)
			if (defaultRole === "BUYER") {
				await tx.buyer.create({
					data: {
						user_ID: user.ID,
					},
				});
			} else {
				await tx.seller.create({
					data: {
						user_ID: user.ID,
					},
				});
			}

			return user;
		});

		const payload = {
			id: newUser.ID,
			username: newUser.username,
			email: newUser.email,
			roles: [defaultRole],
		};
		const token = generateToken(payload);

		res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				username: newUser.username,
				email: newUser.email,
				name: newUser.name,
				id: newUser.ID,
				avatar: newUser.avatar,
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

		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				Buyer: true,
				Seller: true,
			},
		});

		if (!user)
			return res.status(400).json({ message: "Invalid email or password" });

		const valid = await comparePassword(password, user.password);

		if (!valid)
			return res.status(400).json({ message: "Invalid email or password" });

		const roles = [];
		if (user.Buyer) {
			roles.push("BUYER");
		}
		if (user.Seller) {
			roles.push("SELLER");
		}
		const payload = {
			id: user.ID,
			username: user.username,
			email: user.email,
			roles: roles,
		};
		const token = generateToken(payload);

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user.ID,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
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
