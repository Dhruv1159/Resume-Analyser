import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PercentageDonut from "./PercentageDonut.jsx";

export default function DownloadTemplate({ analysis, report }) {
  const reportRef = useRef();
  const [btnhover, setbtnhover] = useState(false);

  const handleDownloadPDF = () => {
    if (!report || !analysis) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = { top: 15, bottom: 15, left: 15, right: 15 };
    let y = margin.top; // start drawing after top margin
    const maxWidth = pageWidth - margin.left - margin.right;

    const addPageIfNeeded = (heightNeeded) => {
      if (y + heightNeeded > pageHeight - margin.bottom) {
        doc.addPage();
        y = margin.top; // reset y to top margin on new page
      }
    };

    // Candidate Introduction
    doc.setFontSize(14);
    addPageIfNeeded(10);
    doc.text("Candidate Introduction", margin.left, y);
    y += 10;

    doc.setFontSize(12);
    const introLines = doc.splitTextToSize(report.introduction, maxWidth);
    addPageIfNeeded(introLines.length * 7);
    doc.text(introLines, margin.left, y);
    y += introLines.length * 7 + 5;

    // Interview Questions
    doc.setFontSize(14);
    addPageIfNeeded(10);
    doc.text("Interview Questions", margin.left, y);
    y += 10;

    Object.keys(report.qa).forEach((section, secIndex) => {
      doc.setFontSize(12);
      addPageIfNeeded(7);
      doc.text(`${secIndex + 1}. ${section}`, margin.left, y);
      y += 7;

      report.qa[section].forEach((item, qIndex) => {
        const questionHeight = 6;
        const answerLines = doc.splitTextToSize(
          `Answer: ${item.answer}`,
          maxWidth - 10
        );
        const answerHeight = answerLines.length * 6;

        addPageIfNeeded(questionHeight + answerHeight + 3);

        doc.setFontSize(11);
        doc.text(`${qIndex + 1}. Q: ${item.question}`, margin.left + 5, y);
        y += 6;
        doc.text(answerLines, margin.left + 10, y);
        y += answerHeight + 3;
      });
      y += 5;
    });

    // Resume Analysis
    doc.setFontSize(14);
    addPageIfNeeded(10);
    doc.text("Resume Analysis", margin.left, y);
    y += 10;

    doc.setFontSize(12);
    addPageIfNeeded(7);
    doc.text(`Score: ${analysis.score}`, margin.left + 5, y);
    y += 7;

    const summaryLines = doc.splitTextToSize(
      `Summary: ${analysis.summary}`,
      maxWidth - 5
    );
    addPageIfNeeded(summaryLines.length * 6 + 5);
    doc.text(summaryLines, margin.left + 5, y);
    y += summaryLines.length * 6 + 5;

    doc.text("Recommendations:", margin.left + 5, y);
    y += 7;

    analysis.recommendations.forEach((r, idx) => {
      const recLines = doc.splitTextToSize(`${idx + 1}. ${r}`, maxWidth - 10);
      addPageIfNeeded(recLines.length * 6 + 3);
      doc.text(recLines, margin.left + 10, y);
      y += recLines.length * 6 + 3;
    });

    doc.save("Resume_Full_Report.pdf");
  };

  return (
    <div
      style={{
        fontFamily: "calibri",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        ref={reportRef}
        style={{
          padding: "20px",
          background: "#fff",
          color: "#000",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {/* Candidate Introduction */}
        {report?.introduction && (
          <>
            <h2 style={{ color: "darkblue" }}>Candidate Introduction</h2>
            <p>{report.introduction}</p>
          </>
        )}

        {/* Interview Questions */}
        {report?.qa && (
          <>
            <h2 style={{ color: "darkblue" }}>Interview Questions</h2>
            {Object.keys(report.qa).map((section, secIndex) => (
              <div key={section} style={{ marginBottom: "15px" }}>
                <h3 style={{ color: "blue" }}>
                  {secIndex + 1}.{" "}
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                {Array.isArray(report.qa[section]) &&
                  report.qa[section].map((item, qIndex) => (
                    <div
                      key={qIndex}
                      style={{ marginLeft: "15px", marginBottom: "10px" }}
                    >
                      <p style={{ color: "#3362e4ff" }}>
                        <strong>
                          {qIndex + 1}. {item.question}
                        </strong>
                      </p>
                      <p style={{ marginLeft: "15px" }}>
                        <strong style={{ color: "green" }}>Answer:</strong>{" "}
                        {item.answer}
                      </p>
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          marginBottom: "20px",
          borderRadius: btnhover ? "12px" : "8px",
          border: btnhover ? "2px solid blue" : "2px solid black",
          background: btnhover
            ? "white"
            : "linear-gradient(to right, blue, purple)",
          color: btnhover ? "blue" : "white",
        }}
        onMouseEnter={() => setbtnhover(true)}
        onMouseLeave={() => setbtnhover(false)}
      >
        Download Full Report
      </button>
    </div>
  );
}
