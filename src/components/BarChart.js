import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData }) {
  return (
    <Bar
      data={chartData}
      options={{
        indexAxis: "y",
        // color: "#fff",
        // scales: {
        //   y: {
        //     ticks: { color: "white", beginAtZero: true },
        //   },
        //   x: {
        //     ticks: { color: "white", beginAtZero: true },
        //   },
        // },
      }}
    />
  );
}

export default BarChart;
