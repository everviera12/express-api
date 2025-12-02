const { Router } = require("express");
const { getProviderController, getProviderIdController } = require("../controllers/providers.controller");

const router = Router();

router.get("/providers", getProviderController);
router.get("/providers/:id", getProviderIdController);

module.exports = router;