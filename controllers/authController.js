const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

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
    passwordConfirm: req.body.passwordConfirm,
    //passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
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
  //console.log(token);
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
  console.log(freshUser);
  next();
});

// we return a function bez we cannot pass aruguments to middleware in nodejs
//
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to delete', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1 get the user info base on the email id
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user by this email id', 404));
  }

  //2 call the instance method of resetpassword(createPasswordResetToken)
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password!! submit a PITCH request with password and passwordconfirm to:${resetURL}. \n If you didn't forget then please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token.[ Valid for 10 min]',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to mail'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('there was an error while sending email.Try later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get the user base on the token but first incrypt the token as per the document we have done
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // in moongo we can serach and also check for some condition also we want to check
  // now find the user base on the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // if no user send error
  if (!user) {
    return next(new AppError('Token is invalid or expired!!', 400));
  }

  // now update the user password and set the passwordResetToken & passwordResetExpires to undefined as
  // we want it to confirm that the password is change and for further if the user again forgot the password
  // we will again genrate a new token  and save it in the document
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // log the user in with the new JWT token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});
