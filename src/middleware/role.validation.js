const { getUserInfoService } = require("../services/auth.service");

/**
 * Middleware factory to restrict access based on user roles.
 * Verifies the user's role against the database and populates the request object with profile data.
 * @param {...string} allowedRoles - List of roles permitted to access the route.
 */
const roleMiddleware = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            const { data, error } = await getUserInfoService(userId);

            if (error || !data) {
                return res.status(403).json({
                    success: false,
                    message: "User role not found",
                });
            }

            if (!allowedRoles.includes(data.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient permissions",
                });
            }

            req.user.role = data.role;
            req.user.first_name = data.first_name;
            req.user.last_name = data.last_name;

            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Role middleware error",
            });
        }
    };
};

module.exports = { roleMiddleware };
