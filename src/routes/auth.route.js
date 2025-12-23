const { Router } = require("express");
const { loginAuth, registerUser, userInformation } = require("../controllers/auth.controller");
const { validate, loginSchema, registerSchema } = require("../middleware/validations");
const { authMiddleware } = require("../middleware/auth");

const router = Router();

router.post(
    "/auth/login",
    validate(loginSchema, "body"),
    loginAuth
);

router.post(
    "/auth/register",
    validate(registerSchema, "body"),
    registerUser
);

router.get("/profile", authMiddleware, userInformation);

/* router.post("/auth/logout", authMiddleware, logoutAuth); */

module.exports = router;
