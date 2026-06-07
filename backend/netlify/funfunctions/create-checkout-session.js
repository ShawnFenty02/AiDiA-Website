const express = require("express");
const stripe = require("stripe")("YOUR_SECRET_KEY");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { quantity, country } = req.body;

  let shipping = 0;

  if (country === "Jamaica") shipping = 800;
  if (country === "USA") shipping = 1500;
  if (country === "UK") shipping = 1800;
  if (country === "Canada") shipping = 1700;
  if (country === "International") shipping = 2500;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "AiDiA My BFF Bear"
            },
            unit_amount: 24999 + shipping
          },
          quantity: quantity
        }
      ],
      success_url: "https://your-site.com/success.html",
      cancel_url: "https://your-site.com/cancel.html"
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running"));
