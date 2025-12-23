const { getUserInfoService, registerService, authService } = require("../services/auth.service");

const getUserController = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await getUserInfoService(userId);

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: "User role not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: userId,
                first_name: data.first_name,
                last_name: data.last_name,
                email: req.user.email,
                role: data.role,
            },
        });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

const authController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await authService(email, password);

        if (error) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }


        return res.status(200).json({
            success: true,
            user: data,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

const registerController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const { data, error } = await registerService(email, password);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: data.user,
            session: data.session ?? null,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getUserController,
    authController,
    registerController
};
