const { Router } = require("express");
const { getProviderController, getProviderIdController } = require("../controllers/providers.controller");

const router = Router();

router.get("/", getProviderController);
router.get("/:id", getProviderIdController);

module.exports = router;