const stripe = require('stripe')(process.env.STRIPE_SECRETKEY);
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //get the booked tour by the user 

  const tour = await Tour.findById(req.params.tourID);
  //create checkout session
  // the create function will do an API call to stripe 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // method to accept the payment 
    success_url: `${req.protocol}://${req.get('host')}/`, // will be called when payment will be successfull
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
  console.log('hi');
  res.status(200).json({
    status: 'success',
    session
  })
})
//https://stripe.com/docs/payments/checkout/one-time