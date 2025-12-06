// api.js
export const API_BASE = "http://localhost:5000/api"; // change if needed

export const analyzeResume = async (file, jobRole) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobRole", jobRole);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

export const getResumeReport = async (file, jobRole) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobRole", jobRole);

  const res = await fetch(`${API_BASE}/report`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};
