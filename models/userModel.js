const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcryptjs');

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
    minlength: 8,
    validate: {
      // only work on SAVE and Create
      validator: function(el) {
        return el === this.password; // check if passwordConfirm with the password to see both are same or not
      },
      message: 'Password are not same'
    }
  }
});

userSchema.pre('save', async function(next) {
  // only run it the password is modified
  if (!this.isModified('password')) return next();

  //bootforce attack
  //hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
