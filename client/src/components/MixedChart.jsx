import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  BarElement,
} from "chart.js";

Chart.register(
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  BarElement
);

export const MixedChart = (props) => {
  console.log("props", props);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        label: "Aggregate Amount",
        data: [],
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: "Increased Amount",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
    options: {
      legend: {
        display: true,
      },
    },
  });

  useEffect(() => {
    axios
      .get(
        `http://34.125.1.254:8800/api/admin/data/${props.category}/${props.year}`
      )
      .then((response) => {
        const data = response.data; // Use response.data to access the JSON data
        setChartData((prev) => ({
          ...prev,
          labels: data.labels,
          datasets: prev.datasets.map((dataset, index) => {
            if (index === 0) {
              // Assuming the first dataset is the line chart
              return { ...dataset, data: data.aggregate };
            } else if (index === 1) {
              // Assuming the second dataset is the bar chart
              return { ...dataset, data: data.increasing };
            }
            return dataset;
          }),
        }));
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [props.category, props.year]);

  return (
    <div>
      <Line data={chartData} />
      <div className="chartExplanation">
        <div className="chartExplanationItem">
          <span className="lineRepresentation"></span>
          <strong>Total {props.category}</strong>
        </div>
        <div className="chartExplanationItem">
          <span className="barRepresentation"></span>
          <strong>New {props.category} in the month</strong>
        </div>
      </div>
    </div>
  );
};
