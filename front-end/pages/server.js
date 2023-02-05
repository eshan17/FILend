/** @format */

const express = require("express");
const app = express();

app.use(express.json());

app.post("/server", (req, res) => {
  console.log(req.body);
  res.json({ message: "set Data received successfully" });
});

app.get("/server", (req, res) => {
  console.log(req.body);
  res.json({ message: "get Data received successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.post("/Lender/:address", (req, res) => {
  var id = req.params.address;
  console.log(req.params.address);
});

app.get("/Lender/:address", (req, res) => {
  console.log(req.params.address);
});