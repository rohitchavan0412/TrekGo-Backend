const mongoose = require('mongoose');
const Validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Your Name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email id'],
    unique: true,
    lowercase: true,
    validate: [Validator.isEmail, 'Please enter a valid Email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please Enter a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm the password'],
    minlength: 8
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
