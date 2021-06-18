const express = require("express");
const app = express();

const stripeCustomer = require("./stripeCustomer");
const port = 6000;

app.use(express.json());

app.use("/api/", stripeCustomer);
app.use("/api/", require("./stripeCard"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});