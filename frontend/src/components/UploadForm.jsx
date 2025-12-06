// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { analyzeResume, getResumeReport } from "../api";
// import ResultCard from "./ResultCard";
// import Spinner from "./Spinner";

// export default function UploadForm() {
//   const [file, setFile] = useState(null);
//   const [jobRole, setJobRole] = useState("");
//   const [loadingAnalyze, setLoadingAnalyze] = useState(false);
//   const [loadingReport, setLoadingReport] = useState(false);
//   const [analysis, setAnalysis] = useState(null);
//   const [report, setReport] = useState(null);
//   const [error, setError] = useState("");

//   const onDrop = useCallback((acceptedFiles) => {
//     if (acceptedFiles && acceptedFiles.length) {
//       setFile(acceptedFiles[0]);
//       setAnalysis(null);
//       setReport(null);
//       setError("");
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple: false,
//     accept: {
//       "application/pdf": [".pdf"],
//       "application/msword": [".doc"],
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//         [".docx"],
//       "text/plain": [".txt"],
//     },
//   });

//   // Analyze resume
//   const handleAnalyze = async () => {
//     if (!file) return setError("Please upload a resume file.");
//     if (!jobRole.trim()) return setError("Please enter a job role.");

//     try {
//       setError("");
//       setLoadingAnalyze(true);
//       const res = await analyzeResume(file, jobRole);
//       if (res?.success && res.result) setAnalysis(res.result);
//       else setError("Unexpected response from server.");
//     } catch (err) {
//       setError(err.message || "Error analyzing resume");
//     } finally {
//       setLoadingAnalyze(false);
//     }
//   };

//   // Get full resume prep report (introduction + interview Q&A)
//   const handleGetReport = async () => {
//     if (!file) return setError("Please upload a resume file first.");
//     if (!jobRole.trim()) return setError("Please enter a job role.");

//     try {
//       setError("");
//       setLoadingReport(true);
//       const res = await getResumeReport(file, jobRole);
//       if (res?.success && res.result) setReport(res.result);
//       else setError("Unexpected response from server.");
//     } catch (err) {
//       setError(err.message || "Error fetching resume report");
//     } finally {
//       setLoadingReport(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "800px", margin: "0 auto" }}>
//       {/* File Upload */}
//       <div
//         {...getRootProps()}
//         style={{
//           border: "2px solid black",
//           padding: "20px",
//           textAlign: "center",
//           cursor: "pointer",
//           background: isDragActive ? "#eef" : "#fafafa",
//         }}
//       >
//         <input {...getInputProps()} />
//         <p>
//           {file
//             ? `Selected file: ${file.name}`
//             : "Drag & drop your resume here, or click to select"}
//         </p>
//       </div>

//       {/* Job Role Input & Analyze Button */}
//       <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
//         <input
//           type="text"
//           placeholder="Enter Job Role (e.g. Frontend Developer)"
//           value={jobRole}
//           onChange={(e) => setJobRole(e.target.value)}
//           style={{ flex: 1, padding: "8px" }}
//         />
//         <button
//           onClick={handleAnalyze}
//           disabled={loadingAnalyze}
//           style={{ padding: "8px 16px" }}
//         >
//           {loadingAnalyze ? <Spinner /> : "Analyze"}
//         </button>
//       </div>

//       {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

//       {/* Analysis Result */}
//       {analysis && (
//         <div style={{ marginTop: "30px" }}>
//           <ResultCard analysis={analysis} />
//         </div>
//       )}

//       {/* Resume Prep Report Button */}
//       {analysis && (
//         <div style={{ marginTop: "15px" }}>
//           <button onClick={handleGetReport} disabled={loadingReport}>
//             {loadingReport ? "Loading..." : "Get Resume Prep Report"}
//           </button>
//         </div>
//       )}

//       {/* Report Result */}
//       {report && (
//         <div
//           style={{ marginTop: "20px", background: "#f9f9f9", padding: "10px" }}
//         >
//           <h3>Candidate Introduction</h3>
//           <p>{report.introduction}</p>

//           <h3>Interview Questions</h3>
//           {Object.keys(report.qa).map((section, secIndex) => (
//             <div key={section} style={{ marginBottom: "15px" }}>
//               <h4>
//                 {secIndex + 1}.{" "}
//                 {section.charAt(0).toUpperCase() + section.slice(1)}
//               </h4>
//               {Array.isArray(report.qa[section]) &&
//                 report.qa[section].map((item, qIndex) => (
//                   <div
//                     key={qIndex}
//                     style={{ marginLeft: "15px", marginBottom: "10px" }}
//                   >
//                     <p>
//                       <strong>
//                         {qIndex + 1}. {item.question}
//                       </strong>
//                     </p>
//                     <p style={{ marginLeft: "15px" }}>Answer: {item.answer}</p>
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// new file with download button

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeResume, getResumeReport } from "../api";
import ResultCard from "./ResultCard";
import Spinner from "./Spinner";
import DownloadTemplate from "./DownloadTemplate";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [hover, setHover] = useState(false);
  const [btnhover, setbtnHover] = useState(false);
  const [prephover, setprephover] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      setAnalysis(null);
      setReport(null);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  const handleAnalyze = async () => {
    if (!file) return setError("Please upload a resume file.");
    if (!jobRole.trim()) return setError("Please enter a job role.");
    try {
      setError("");
      setLoadingAnalyze(true);
      const res = await analyzeResume(file, jobRole);
      if (res?.success && res.result) setAnalysis(res.result);
      else setError("Unexpected response from server.");
    } catch (err) {
      setError(err.message || "Error analyzing resume");
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleGetReport = async () => {
    if (!file) return setError("Please upload a resume file first.");
    if (!jobRole.trim()) return setError("Please enter a job role.");
    try {
      setError("");
      setLoadingReport(true);
      const res = await getResumeReport(file, jobRole);
      if (res?.success && res.result) setReport(res.result);
      else setError("Unexpected response from server.");
    } catch (err) {
      setError(err.message || "Error fetching resume report");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* File Upload */}
      <div
        {...getRootProps()}
        style={{
          border: "2px solid black",
          borderRadius: "16px",
          padding: "30px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragActive ? "#e9ebf1ff" : "white",
        }}
      >
        <input {...getInputProps()} />
        <p
          style={{
            fontSize: "20px",
            color: hover ? "blue" : "black",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {file
            ? `Selected file: ${file.name}`
            : "Drag & drop your resume here, or click to select"}
        </p>
      </div>

      {/* Job Role Input & Analyze Button */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Job Role (e.g. Frontend Developer)"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loadingAnalyze}
          style={{
            padding: "8px 16px",
            fontSize: "16px",
            borderRadius: btnhover ? "12px" : "8px",
            border: btnhover ? "2px solid blue" : "2px solid black",
            background: btnhover
              ? "white"
              : "linear-gradient(to right, blue, purple)",
            color: btnhover ? "blue" : "white",
          }}
          onMouseEnter={() => setbtnHover(true)}
          onMouseLeave={() => setbtnHover(false)}
        >
          {loadingAnalyze ? <Spinner /> : "Analyze"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* Analysis Result */}
      {analysis && (
        <div
          style={{
            marginTop: "30px",
          }}
        >
          <ResultCard analysis={analysis} />
        </div>
      )}

      {/* Resume Prep Report Button */}
      {analysis && (
        <div style={{ marginTop: "15px" }}>
          <button
            onClick={handleGetReport}
            disabled={loadingReport}
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              borderRadius: prephover ? "12px" : "8px",
              border: prephover ? "2px solid blue" : "2px solid black",
              background: prephover
                ? "white"
                : "linear-gradient(to right, blue, purple)",
              color: prephover ? "blue" : "white",
            }}
            onMouseEnter={() => setprephover(true)}
            onMouseLeave={() => setprephover(false)}
          >
            {loadingReport ? "Loading..." : "Get Resume Prep Report"}
          </button>
        </div>
      )}

      {/* Show DownloadTemplate after report is ready */}
      {report && <DownloadTemplate analysis={analysis} report={report} />}
    </div>
  );
}
