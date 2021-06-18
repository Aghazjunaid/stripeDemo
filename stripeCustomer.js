const express = require("express");
const router = express.Router();
const Stripe_Key = "";
const stripe = require("stripe")(Stripe_Key);


router.get("/", (req, res) => {
  res.status(200).json({
    message: "Stripe Hello World!",
  });
});


// Create a new customer for stripe
router.post("/newCustomer", async (req, res) => {
  try {
    const customer = await stripe.customers.create(
      {
        email: req.body.email,
        name: req.body.name,
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '110092', 
            city: 'New Delhi', 
            state: 'Delhi', 
            country: 'India', 
        } 
      }
      // {
      //   // If you are using your own api then you can add your organization account here. So it will link the customer with your organization
      //   stripeAccount: process.env.StripeAccountId,
      //}
    );
    return res.status(200).send({
      //   customerDetails: customer,
      customerDetails: customer
    });
  } catch (error) {
        return res.status(400).send({ Error: error.raw.message });
  }
});


// Get customer by CustomerId
router.get("/getCustomer/:id", async (req, res) => {
    try {
      const customer = await stripe.customers.retrieve(
        req.params.id
      );
      return res.status(200).send({
        //   customerDetails: customer,
        customerDetails: customer
      });
    } catch (error) {
        return res.status(400).send({ Error: error.raw.message });
    }
});
  

// Update customer
router.post("/updateCustomer/:id", async (req, res) => {
    try {
      const customer = await stripe.customers.update(
        req.params.id,
        {
          name: req.body.name, 
          metadata: {order_id: '6735'}
        }
      );
      return res.status(200).send({
        customerDetails: customer
      });
    } catch (error) {
      return res.status(400).send({ Error: error.raw.message });
    }
  });
  
  
// Delete customer
router.delete("/deleteCustomer/:id", async (req, res) => {
    try {
      const customer = await stripe.customers.del(
        req.params.id,
      );
      return res.status(200).send({
        customerDetails: customer
      });
    } catch (error) {
      return res.status(400).send({ Error: error.raw.message });
    }
  });
  

// Get All customer for stripe
router.get("/getAll", async (req, res) => {
  try {
    const customer = await stripe.customers.list(
      {
        limit: req.body.limit
      }
    );
    return res.status(200).send({
      customerDetails: customer
    });
  } catch (error) {
    return res.status(400).send({ Error: error.raw.message });
  }
});



module.exports = router;