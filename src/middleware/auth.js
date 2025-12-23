const { supabaseConnection } = require("../connection/supabase");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }

        const token = authHeader.replace("Bearer ", "");

        const { data, error } = await supabaseConnection.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        // Usuario autenticado disponible en toda la request
        req.user = data.user;
        next();
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Auth middleware error",
        });
    }
};

module.exports = { authMiddleware };
