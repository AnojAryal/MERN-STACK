const express = require('express')
const {createWorkout, getWorkouts, getWorkoutById,} = require('../controllers/workoutController')

const router = express.Router()

//get all workouts
router.get('/', getWorkouts)

//get workout by id
router.get('/:id', getWorkoutById)

//post a new workout
router.post('/', createWorkout)


module.exports = router 