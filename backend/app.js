require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);

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
