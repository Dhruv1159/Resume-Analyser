import React from "react";

export default function Footer() {
  return (
    <div>
      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          background: "linear-gradient(to right, blue, purple)",
          height: "60px",
          lineHeight: "60px",
          color: "white",
          fontWeight: "bold",
          fontFamily: "calibri",
          fontSize: "20px",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 999,
          margin: "0px",
          marginTop: "20px",
        }}
      >
        Created By : <b>Dhruv Saini</b> | <b>Sagar Jat</b>
      </p>
    </div>
  );
}
