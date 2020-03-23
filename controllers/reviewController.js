const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {

  let filter = {}

  if (req.params.tourId) filter = { tour: req.params.tourId }

  const reviews = await Review.find(filter)

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  })

})

exports.getReview = catchAsync(async (req, res, next) => {

  let review = await Review.findById(req.params.id)
  if (!review) {
    return next(new AppError('No review found for the given id', 401))
  }

  res.status(200).json({
    status: 'success',
    data: review
  })
})

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id

  const newReview = await Review.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  })
})

exports.deleteReview = catchAsync(async (req, res, next) => {

  await Review.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data: null
  })

})

exports.updateReview = catchAsync(async (req, res, next) => {

  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  res.status(201).json({
    status: 'success',
    data: review
  })
})