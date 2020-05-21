const router = require('express').Router({ mergeParams: true });
const bookingController = require('../controllers/bookingController')
const authController = require('../controllers/authController');

router.get('/checkout-session/:tourID', authController.protect, bookingController.getCheckoutSession)

router
  .route('/')
  .get(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.getAllBooking
  );

router
  .route('/:id')
  .get(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.getOneBooking
  )
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.UpdateBooking
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.deleteBooking
  )

module.exports = router 