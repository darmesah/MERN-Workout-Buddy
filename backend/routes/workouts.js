const express = require('express');
const workoutsController = require('../controller/workouts');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all workout routes
router.use(requireAuth);

router.get('/', workoutsController.getWorkouts);

router.get('/:id', workoutsController.getWorkout);

router.post('/', workoutsController.addWorkout);

router.delete('/:id', workoutsController.deleteWorkout);

router.patch('/:id', workoutsController.updateWorkout);

module.exports = router;
