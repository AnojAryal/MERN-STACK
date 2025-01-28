const express = require("express");

const { handleUserLogin } = require("../controllers/authController");

const router = express.Router();

//login
router.post("/", handleUserLogin);

module.exports = router;
