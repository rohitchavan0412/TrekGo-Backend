const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// this fun will filter the obj Asper the fields we send to it
const filterObj = (obj, ...allowedFields) => {
  // allowedField is an array by using rest[...] ES6 way
  const newObj = {};
  Object.keys(obj).forEach(el => {
    //Object.keys will return an array and then loop over it
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const docMe = await User.findById(req.user.id)
  if (!docMe) {
    return next(new AppError('No user found', 400))
  }

  res.status(200).json({
    status: 'success',
    data: docMe
  });
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // donot update the user password over here
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update', 400));
  }

  // we dont want the user to change the role[from user to admin] so we filter the body object
  const filterBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true, // by doing true it will return the new updated object
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});



exports.getUser = catchAsync(async (req, res, next) => {

  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new AppError('No user found', 400))
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update', 400));
  }

  // we dont want the user to change the role[from user to admin] so we filter the body object
  const filterBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.params.id, filterBody, {
    new: true, // by doing true it will return the new updated object
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {

  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    return next(new AppError('No user by this Id in the collectons', 400))
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
