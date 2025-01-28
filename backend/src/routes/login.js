const express = require("express");

const {
  handleUserLogin,
  handleRefreshToken,
} = require("../controllers/authController");

const router = express.Router();

//login
router.post("/", handleUserLogin);

// Refresh token route
router.post("/refresh-token", handleRefreshToken);

module.exports = router;
