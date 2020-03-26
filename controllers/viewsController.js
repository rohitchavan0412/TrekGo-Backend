const Tour = require('./../models/tourModel')
const catchAsync = require('../utils/catchAsync');

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

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest hiker tour'
  })
}