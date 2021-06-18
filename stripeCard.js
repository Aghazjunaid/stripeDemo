const express = require("express");
const router = express.Router();
const Stripe_Key = "";
const stripe = require("stripe")(Stripe_Key);

// Add a new card of the customer
router.post("/addNewCard/:id", async (req, res) => {
    const {
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCVC,
      cardName,
      country,
      postal_code,
    } = req.body;
  
    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
      return res.status(400).send({
        Error: "Please Provide All Necessary Details to save the card",
      });
    }
    try {
      const cardToken = await stripe.tokens.create({
        card: {
          name: cardName,
          number: cardNumber,
          exp_month: cardExpMonth,
          exp_year: cardExpYear,
          cvc: cardCVC,
          address_country: country,
          address_zip: postal_code,
        },
        // customer: customer.stripe_id,
        // stripe_account: StripeAccountId,
      });
  
      const card = await stripe.customers.createSource( req.params.id , {
        source: `${cardToken.id}`,
      });
  
      return res.status(200).send({
        cardDetails: card,
      });
    } catch (error) {
      return res.status(400).send({
        Error: error.raw.message,
      });
    }
  });
  
  









module.exports = router;