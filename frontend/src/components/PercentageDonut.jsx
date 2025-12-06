import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PercentageDonut = ({ percent }) => {
  // clamp value between 0 and 100 just in case
  const safePercent = Math.max(0, Math.min(100, percent));

  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        label: "Percentage",
        data: [safePercent, 100 - safePercent],
        backgroundColor: ["#253097ff", "#E0E0E0"], // filled + remaining
        hoverBackgroundColor: ["#253097ff", "#cfcfcf"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "70%", // makes it donut instead of full pie
    plugins: {
      legend: {
        display: false, // hide legends to keep it clean
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "150px",
        height: "150px",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <Doughnut data={data} options={options} />

      {/* Percentage text in the center (overlay) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {safePercent}%
      </div>
    </div>
  );
};

export default PercentageDonut;
