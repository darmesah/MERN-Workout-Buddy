const Workout = require('../models/workout');
const mongoose = require('mongoose');

exports.getWorkouts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const workouts = await Workout.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(workouts);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getWorkout = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Workout not found' });
    }

    const workout = await Workout.findById(id);

    workoutNotExist(workout);

    res.status(200).json(workout);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.addWorkout = async (req, res, next) => {
  const { title, load, reps } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push('title');
  }
  if (!load) {
    emptyFields.push('load');
  }
  if (!reps) {
    emptyFields.push('reps');
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ message: 'Please fill in all the fields', emptyFields });
  }

  try {
    const userId = req.user._id;
    const workout = await Workout.create({
      title,
      load,
      reps,
      userId,
    });

    res.status(201).json(workout);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteWorkout = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Workout not found' });
    }

    const workout = await Workout.findById(id);

    workoutNotExist(workout);

    await Workout.findByIdAndRemove(id);

    res.status(200).json(workout);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateWorkout = async (req, res, next) => {
  const { id } = req.params;
  const updates = {
    load: req.body.load,
    reps: req.body.reps,
  };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Workout not found' });
  }

  try {
    const workout = await Workout.findByIdAndUpdate(
      id,
      {
        ...updates,
      },
      { new: true }
    );

    workoutNotExist(workout);

    res.status(200).json(workout);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const workoutNotExist = (workout) => {
  if (!workout) {
    res.status(400).json({ message: 'Workout not found' });
  }
};
