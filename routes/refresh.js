const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController.js");

router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;
