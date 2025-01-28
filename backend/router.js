const express = require("express");

const workoutRoutes = require("./src/routes/workouts");
const userRoutes = require("./src/routes/user");
const loginRoutes = require("./src/routes/login");

const router = express.Router();

//main routes
router.use("/api/workouts", workoutRoutes);
router.use("/api/users", userRoutes);
router.use("/jwt/auth/login", loginRoutes);

module.exports = router;
