const { loginWithEmail, registerWithEmail } = require("../services/auth.service");

const loginAuth = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await loginWithEmail(email, password);

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

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const { data, error } = await registerWithEmail(email, password);

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

const logoutAuth = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logout successful (client must delete token)",
    });
};

module.exports = { loginAuth, registerUser, logoutAuth };
