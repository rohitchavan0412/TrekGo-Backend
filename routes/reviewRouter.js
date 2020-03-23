const router = require('express').Router({ mergeParams: true });
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

// All route from this onward are protected and used by only admin and user
router.use(authController.protect)
router.route('/:id')
  .get(reviewController.getReview)
  .delete(authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )

module.exports = router 