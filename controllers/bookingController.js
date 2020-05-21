const stripe = require('stripe')(process.env.STRIPE_SECRETKEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');



exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //get the booked tour by the user 

  const tour = await Tour.findById(req.params.tourID);
  //create checkout session
  // the create function will do an API call to stripe 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // method to accept the payment 
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
      }&user=${req.user.id}&price=${tour.price} `, // will be called when payment will be successfull
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`], // the images must be hosted online bez this images will be add in stripes server
        amount: tour.price,
        currency: 'inr',
        quantity: 1
      }
    ] //this is to show info of your product in the payment page  
  })
  //console.log('hi');
  res.status(200).json({
    status: 'success',
    session
  })
})
//https://stripe.com/docs/payments/checkout/one-time

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }
  console.log(tour, user, price)
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking = (req, res, next) => {

}

exports.getAllBooking = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: bookings.length,
    data: {
      bookings
    }
  })
})

exports.getOneBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No Booking with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  })
})

exports.UpdateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!booking) {
    return next(new AppError('No Booking with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
})

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(new AppError('No Booking with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
})