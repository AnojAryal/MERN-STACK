const express = require("express");
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");

const router = express.Router();

//get all workouts
router.get("/", getWorkouts);

//get workout by id
router.get("/:id", getWorkoutById);

//post a new workout
router.post("/", createWorkout);

//delete workout
router.delete("/:id", deleteWorkout);

//update workout
router.patch("/:id", updateWorkout);

module.exports = router;
