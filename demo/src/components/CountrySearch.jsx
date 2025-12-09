import React, { useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

const CountrySearch = () => {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [universities, setUniversities] = useState([]);
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    if (!country) {
      setUniversities([]);
      setProvinces([]);
      setProvince("");
      return;
    }

    const fetchUniversities = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/universities/country/${country}`);
        setUniversities(res.data);

        const uniqueProvinces = [...new Set(res.data.map(u => u["state-province"]).filter(Boolean))];
        setProvinces(uniqueProvinces);
        setProvince("");
      } catch (err) {
        console.error(err);
        setUniversities([]);
        setProvinces([]);
      }
    };

    const timer = setTimeout(() => fetchUniversities(), 300);
    return () => clearTimeout(timer);
  }, [country]);

  const filteredUniversities = province
    ? universities.filter(u => u["state-province"] === province)
    : universities;

  const handleDownload = (cardId, uniName) => {
    const element = document.getElementById(cardId);
    if (!element) return;

    html2canvas(element).then(canvas => {
      const link = document.createElement("a");
      link.download = `${uniName}.jpeg`;
      link.href = canvas.toDataURL("image/jpeg", 1.0);
      link.click();
    });
  };

  return (
    <div>
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Enter country..."
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />
        {provinces.length > 0 && (
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            style={{ padding: "10px", width: "250px" }}
          >
            <option value="">All States/Provinces</option>
            {provinces.map((p, idx) => (
              <option key={idx} value={p}>{p}</option>
            ))}
          </select>
        )}
      </div>

      <div style={{
        display: "grid",
        border: "1px solid #ccc",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
      }}>
        {filteredUniversities.length > 0 ? (
          filteredUniversities.map((uni, idx) => {
            const cardId = `uni-card-${idx}`;
            return (
              <div key={uni._id} id={cardId} style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                background: "#fafafa",
                textAlign: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}>
                <h3>{uni.name}</h3>
                <p>{uni["state-province"] || "N/A"}</p>
                <a href={uni.web_pages[0]} target="_blank" rel="noopener noreferrer">Visit Website</a>
                <br />
                <button
                  style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
                  onClick={() => handleDownload(cardId, uni.name)}
                >
                  Download Card
                </button>
              </div>
            );
          })
        ) : (
          <p>{country ? "No universities found." : "Start typing a country to search."}</p>
        )}
      </div>
    </div>
  );
};

export default CountrySearch;
