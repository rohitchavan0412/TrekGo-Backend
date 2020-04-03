import axios from "axios";
import { showAlert } from './alert';
//import Stripe from "stripe";

const stripe = Stripe('pk_test_tS5hhlQEvG1HlyFOB5An4UPF00kxvalE4q');

export const bookTour = async tourId => {
  try {
    // Make the tourID field from the Checkout Session  API 
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session)
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })

  } catch (error) {
    showAlert('error', error);
  }
  //
  //create checkout form and charge 
}