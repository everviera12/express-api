const { Router } = require("express");
const { getProviderController, getProviderIdController } = require("../controllers/providers.controller");
const { validate, providersQuerySchema, providerIdSchema } = require("../middleware/validations");

const router = Router();

router.get(
    "/",
    validate(providersQuerySchema, "query"),
    getProviderController,
);

router.get(
    "/:id",
    validate(providerIdSchema, "params"),
    getProviderIdController
);

module.exports = router;