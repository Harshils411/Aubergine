const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const University = require("./models/University");

const app = express();
app.use(cors());

mongoose.connect("mongodb://localhost:27017/universities")
  .then(() => console.log("MongoDB Connected"));

app.get("/universities", async (req, res) => {
  const data = await University.find();
  res.json(data);
});

app.get("/universities/country/:country", async (req, res) => {
  const data = await University.find({ country: req.params.country });
  res.json(data);
});

app.listen(5000, () => console.log("Server running on port 5000"));
