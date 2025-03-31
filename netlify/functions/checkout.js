// netlify/functions/checkout.js
const stripe = require('stripe')(
  'sk_test_51R77Rn2LHIrJmpv9FQhKMFtw07SjXUb98bMtPD3Fwc4Y6Hw7w6YRbhLJxaFnfJD6hVn7m4H3HCl3SBQzPs4B8ciL00kzeCVrxG'
);

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    try {
      const { items } = JSON.parse(event.body);

      console.log('Received items:', items);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        mode: 'payment',
        success_url: 'https://ecommerce-swift-mart.netlify.app/success',
        cancel_url: 'https://ecommerce-swift-mart.netlify.app/cancel',
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ url: session.url }),
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }
};
