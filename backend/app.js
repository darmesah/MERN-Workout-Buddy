require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const workoutRoutes = require('./routes/workouts');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/workouts', workoutRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Something went wrong please try again';
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT);
    console.log('connected');
  })
  .catch((err) => {
    console.log(err);
  });
