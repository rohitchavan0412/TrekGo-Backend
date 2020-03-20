const router = require('express').Router();
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController');


router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  )

// router.route('/:id')
//   .get(reviewController.getAllReviews)
//   .patch(reviewController.createReview)

module.exports = router 