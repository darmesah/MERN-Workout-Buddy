const express = require('express');

const workoutsController = require('../controller/workouts');

const router = express.Router();

router.get('/', workoutsController.getWorkouts);

router.get('/:id', workoutsController.getWorkout);

router.post('/', workoutsController.addWorkout);

router.delete('/:id', workoutsController.deleteWorkout);

router.patch('/:id', workoutsController.updateWorkout);

module.exports = router;
