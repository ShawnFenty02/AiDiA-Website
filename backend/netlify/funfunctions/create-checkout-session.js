const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { quantity, country } = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: "AiDiA My BFF Bear",
        },
        unit_amount: 24999,
      },
      quantity: quantity,
    }],
    mode: "payment",
    success_url: "https://your-site.netlify.app/success.html",
    cancel_url: "https://your-site.netlify.app/cancel.html",
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};
