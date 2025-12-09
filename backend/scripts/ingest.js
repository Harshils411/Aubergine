const axios = require("axios");
const mongoose = require("mongoose");
const University = require("../models/University");

const MONGO_URI = "mongodb://localhost:27017/universities";

async function fetchAndStore() {
  await mongoose.connect(MONGO_URI);
  console.log("DB Connected");

  const url = "https://github.com/Hipo/university-domains-list/blob/master/world_universities_and_domains.json";

  const { data } = await axios.get(url);

  console.log(`Fetched ${data.length} universities`);

  for (const uni of data) {
    await University.updateOne(
      { name: uni.name, country: uni.country },
      { $set: uni },
      { upsert: true }
    );
  }

  console.log("Data Ingested Successfully!");

  process.exit();
}

fetchAndStore();
