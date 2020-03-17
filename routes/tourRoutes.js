const express = require('express');
// getting the tour control function for API request from tourController
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

//MiddleWare function on param to check if the id is valid or not
//will be excuted when the route cantains id(parametrs)
//router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/getMonthlyPlan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
