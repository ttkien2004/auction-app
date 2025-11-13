const checkRole = (requiredRoles) => {
	return (req, res, next) => {
		const userRoles = req.user.roles;

		const hasRole = userRoles.some((role) => requiredRoles.includes(role));
		if (!hasRole) {
			return res.status(403).json({ message: "Forbidden to access" });
		}
		next();
	};
};

module.exports = { checkRole };
