app.get("/universities/country/:country", async (req, res) => {
  try {
    let countryName = req.params.country.trim(); 
    countryName = countryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 

    const data = await University.find({
      country: { $regex: countryName, $options: "i" } 
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /universities/provinces/:country
app.get("/universities/provinces/:country", async (req, res) => {
  try {
    const countryName = req.params.country.trim();
    const provinces = await University.distinct("state-province", {
      country: { $regex: countryName, $options: "i" }
    });
    res.json(provinces.filter(Boolean)); // remove null/undefined values
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
