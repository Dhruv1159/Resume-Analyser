// src/components/Spinner.jsx
import React from "react";

export default function Spinner() {
  return (
    <span
      style={{
        width: "14px",
        height: "14px",
        border: "2px solid #ccc",
        borderTopColor: "transparent",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}
