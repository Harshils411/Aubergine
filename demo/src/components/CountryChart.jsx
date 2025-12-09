import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CountryChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/universities")
      .then((res) => {

        if (!Array.isArray(res.data)) {
          console.error("API returned non-array:", res.data);
          return;
        }

        const map = {};

        res.data.forEach(uni => {
          map[uni.country] = (map[uni.country] || 0) + 1;
        });

        const countries = Object.keys(map).slice(0, 10);
        const counts = Object.values(map).slice(0, 10);

        setChartData({
          labels: countries,
          datasets: [
            {
              label: "Universities Per Country",
              data: counts,
            }
          ]
        });
      })
      .catch(err => console.error(err));
  }, []);

  if (!chartData) return <h3>Loading chart...</h3>;

  return (
    <div style={{ width: "70%", margin: "auto" }}>
      <h2>Top Countries by Number of Universities</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default CountryChart;
