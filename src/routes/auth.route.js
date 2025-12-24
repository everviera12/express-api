const { Router } = require("express");
const { authController, registerController } = require("../controllers/auth.controller");
const { validate, loginSchema, registerSchema } = require("../middleware/validations");
const { authMiddleware } = require("../middleware/auth");

const router = Router();

router.post(
    "/auth/login",
    validate(loginSchema, "body"),
    authController
);

router.post(
    "/auth/register",
    validate(registerSchema, "body"),
    registerController
);

router.get("/profile", authMiddleware, authController);

/* router.post("/auth/logout", authMiddleware, logoutAuth); */

module.exports = router;
