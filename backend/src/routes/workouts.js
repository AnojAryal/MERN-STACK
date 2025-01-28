const express = require("express");
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");

const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

//get all workouts
router.get("/", requireAuth, getWorkouts);

//get workout by id
router.get("/:id",requireAuth, getWorkoutById);

//post a new workout
router.post("/", requireAuth,createWorkout);

//delete workout
router.delete("/:id",requireAuth, deleteWorkout);

//update workout
router.patch("/:id",requireAuth, updateWorkout);

module.exports = router;
