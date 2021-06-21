const express = require("express");
const router = express.Router();
const Stripe_Key = "sk_test_51J3DGCCSN2jNmtALD6nLdovyoaaKZIJ2i3yfk5s38wzi86uQVUYNy7FQPxQ2jS5hd09MnPwTwqcLMIUwi7roH4c800UnstWHEF";
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
  

// Get List of all saved card of the customers
router.get("/viewAllCards/:id", async (req, res) => {
    let cards = [];
    try {
      const savedCards = await stripe.customers.listSources( req.params.id, {
        object: "card",
      });
      const cardDetails = Object.values(savedCards.data);
  
      cardDetails.forEach((cardData) => {
        let obj = {
          cardId: cardData.id,
          cardType: cardData.brand,
          cardExpDetails: `${cardData.exp_month}/${cardData.exp_year}`,
          cardLast4: cardData.last4,
        };
        cards.push(obj);
      });
      return res.status(200).send({
        cardDetails: cards,
      });
    } catch (error) {
      return res.status(400).send({
        Error: error.raw.message,
      });
    }
});
  
  
// Delete a saved card of the customer
router.post("/deleteCard/:customerId/:cardId", async (req, res) => {
    try {
      const deleteCard = await stripe.customers.deleteSource(req.params.customerId, req.params.cardId);
      return res.status(200).send(deleteCard);
    } catch (error) {
      return res.status(400).send({
        Error: error.raw.message,
      });
    }
});
  
  
// Payment With an Existing Card
router.post("/charge", async (req, res) => {
    const { amount,  email, customerId } = req.body;

    try {
      const createCharge = await stripe.charges.create({
        amount: amount,
        currency: "usd",
        receipt_email: email,
        customer: customerId,
        description: `Stripe Charge Of Amount ${amount} for Payment`,
      });
      if (createCharge.status === "succeeded") {
        return res.status(200).send({ Success: createCharge });
      } else {
        return res
          .status(400)
          .send({ Error: "Please try again later for payment" });
      }
    } catch (error) {
      return res.status(400).send({
        Error: error.raw.message,
      });
    }
});

//list all charges
router.get("/getAllCharges", async (req, res) => {
  try {
    const charge = await stripe.charges.list(
      {
        limit: req.body.limit
      }
    );
    return res.status(200).send({
      Details: charge
    });
  } catch (error) {
    return res.status(400).send({ Error: error.raw.message });
  }
});


//Create a full refund
router.get("/fullRefund/:charge", async (req, res) => {
  try {
    const refundCharge = await stripe.refunds.create({
      charge: req.params.charge});
    return res.status(200).send(refundCharge);
  } catch (error) {
    return res.status(400).send({
      Error: error.raw.message,
    });
  }
})

//Create a Partial refund
router.get("/refund/:charge", async (req, res) => {
  try {
    const charge = await stripe.charges.retrieve(
      req.params.charge
    );

    const refundCharge = await stripe.refunds.create({
      charge: req.params.charge,
      amount: charge.amount * 0.95

    });
    return res.status(200).send(refundCharge);
  } catch (error) {
    return res.status(400).send({
      Error: error.raw.message,
    });
  }
})


//list all refunded charges
router.get("/getAllRefundedCharges", async (req, res) => {
  try {
    const refund = await stripe.refunds.list(
      {
        limit: req.body.limit
      }
    );
    return res.status(200).send({
      Details: refund
    });
  } catch (error) {
    return res.status(400).send({ Error: error.raw.message });
  }
});



module.exports = router;