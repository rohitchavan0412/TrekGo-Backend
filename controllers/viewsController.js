const Tour = require('./../models/tourModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError')

exports.base = (req, res) => {
  res.status(200).render('base')
}

exports.getOverview = catchAsync(async (req, res, next) => {
  //get tour data from collection
  const tours = await Tour.find();

  // build template

  //render using the data

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404))
  }

  res.status(200).render('tour', {
    title: 'The forest hiker tour',
    tour
  })
})

exports.login = (req, res) => {
  res.status(200).render('login')
}

exports.getAccount = (req, res) => {
  res.status(200).render('account')
}