const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Static Signup Method
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    const error = new Error('All fields must be filled');
    error.statusCode = 400;
    throw error;
  }
  if (!validator.isEmail(email)) {
    const error = new Error('Email is not valid');
    error.statusCode = 400;
    throw error;
  }
  if (!validator.isStrongPassword(password)) {
    const error = new Error('Password is not strong');
    error.statusCode = 400;
    throw error;
  }

  const exists = await this.findOne({ email });

  if (exists) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await this.create({ email, password: hashedPassword });

  return user;
};

// Static Login Method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    const error = new Error('All fields must be filled');
    error.statusCode = 400;
    throw error;
  }

  const user = await this.findOne({ email });

  if (!user) {
    const error = new Error('User does not exist');
    error.statusCode = 404;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new Error('Incorrect Login Information');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
