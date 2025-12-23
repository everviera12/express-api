const { Router } = require("express");
const { getProviderController, getProviderIdController } = require("../controllers/providers.controller");
const { validate, providersQuerySchema, providerIdSchema } = require("../middleware/validations");
const { authMiddleware } = require("../middleware/auth");
const { roleMiddleware } = require("../middleware/role.validation");

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    validate(providersQuerySchema, "query"),
    getProviderController,
);

router.get(
    "/:id",
    authMiddleware,
    validate(providerIdSchema, "params"),
    getProviderIdController
);

module.exports = router;