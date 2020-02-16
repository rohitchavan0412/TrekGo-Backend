const express = require('express');
// getting the tour control function for API request from tourController
const tourController = require('../controllers/tourController');

const router = express.Router();

//MiddleWare function on param to check if the id is valid or not
//will be excuted when the route cantains id(parametrs)
//router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
