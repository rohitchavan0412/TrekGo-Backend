const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
    //passwordChangedAt: req.body.passwordChangedAt
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // check if valid email amd password
  const user = await User.findOne({ email }).select('+password'); // by default password will not come in output to explicit to select we use the select fun

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1 get the jwt token and check if it exits or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //console.log('hii');
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  //2  check the jwt token is vaild or not
  //401 unauthorized
  if (!token) {
    return next(new AppError('Your are not logined in..Please login ', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // check if user exits or not
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('user does not belong to this token exits', 401));
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User has changed the password', 401));
  }

  req.user = freshUser;
  next();
});
