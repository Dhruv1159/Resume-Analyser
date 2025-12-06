// src/components/ResultCard.jsx
import React from "react";
import PercentageDonut from "./PercentageDonut.jsx";

export default function ResultCard({ analysis }) {
  const { score, summary, recommendations } = analysis;

  return (
    <div
      style={{
        border: "2px solid lightgray",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "20px",
        fontFamily: "calibri",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "blue",
          fontFamily: "calibri",
          fontSize: "30px",
        }}
      >
        Resume Analysis Result
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <p style={{ width: "40%", textAlign: "justify" }}>
          <strong style={{ color: "blue" }}>Summary:</strong> {summary}
        </p>
        <div style={{ textAlign: "center" }}>
          <PercentageDonut percent={score} />
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "blue" }}>
            Resume Score
          </p>
        </div>
      </div>

      <h3 style={{ color: "blue" }}>Recommendations:</h3>
      <ul>
        {Array.isArray(recommendations) ? (
          recommendations.map((r, i) => <li key={i}>{r}</li>)
        ) : (
          <li>{recommendations}</li>
        )}
      </ul>
    </div>
  );
}
