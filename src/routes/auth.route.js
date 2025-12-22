const { Router } = require("express");
const { loginAuth, registerUser } = require("../controllers/auth.controller");
const { validate, loginSchema, registerSchema } = require("../middleware/validations");

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

module.exports = router;
