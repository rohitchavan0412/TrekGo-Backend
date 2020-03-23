const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); //buildin package in nodejs

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
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please Enter a password'],
    minlength: 8,
    select: false // this password filed will not be shown in the output by doing select = false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm the password'],
    minlength: 8,
    validate: {
      // only work on SAVE and Create
      validator: function (el) {
        return el === this.password; // check if passwordConfirm with the password to see both are same or not
      },
      message: 'Password are not same'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function (next) {
  // only run it the password is modified
  if (!this.isModified('password')) return next();

  //bootforce attack
  //hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

//It is an instance method ,this method will be available on all the document of the collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

//query middleware
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// this function for password reset to send a token and check it while changing the password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // this will be store in the  document and will only be valid for 10 min
  // but the token will be incrypted so no one know the actual token using the build in package crypto
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
