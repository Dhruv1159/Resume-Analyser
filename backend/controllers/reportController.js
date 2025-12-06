import axios from "axios";
import { parseResumeFile } from "../utils/fileParser.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const generateResumeReport = async (req, res) => {
  try {
    const { jobRole } = req.body;
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;

    // Parse resume text
    const resumeText = await parseResumeFile(filePath, mimetype);
    fs.unlinkSync(filePath);

    // 1️⃣ Generate Introduction
    const introPrompt = `
      Based on the following resume, write a short professional self-introduction
      for an interview or job application for the role of ${jobRole}.
      It should be 5–6 sentences, natural, confident, and highlight education, skills, and achievements.

      Output strictly in JSON format:
      {
        "introduction": "..."
      }

      Resume:
      ${resumeText}
    `;

    const introRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-70b-instruct",
        messages: [{ role: "user", content: introPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "AI Resume Report",
          "Content-Type": "application/json",
        },
      }
    );

    const introResponse = introRes.data.choices[0].message.content;
    const introMatch = introResponse.match(
      /```json([\s\S]*?)```|```([\s\S]*?)```|(\{[\s\S]*\})/
    );
    const introduction =
      JSON.parse(introMatch?.[1] || introMatch?.[2] || introMatch?.[3])
        ?.introduction || "";

    // 2️⃣ Generate Interview Questions
    const qaPrompt = `
      You are an AI interview coach.
      Generate relevant interview questions and model answers for each of these sections:
      Education , Skills, Experience, and Projects.
      5 question and answers per section eduction , skills , experience , projects.
      Role: ${jobRole}.
      Output strictly in JSON format:
      {
        "interview_questions": {
          "education": [{ "question": "", "answer": "" }],
          "skills": [{ "question": "", "answer": "" }],
          "experience": [{ "question": "", "answer": "" }],
          "projects": [{ "question": "", "answer": "" }]
        }
      }

      Resume:
      ${resumeText}
    `;

    const qaRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-70b-instruct",
        messages: [{ role: "user", content: qaPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "AI Resume Report",
          "Content-Type": "application/json",
        },
      }
    );

    const qaResponse = qaRes.data.choices[0].message.content;
    const qaMatch = qaResponse.match(
      /```json([\s\S]*?)```|```([\s\S]*?)```|(\{[\s\S]*\})/
    );
    const interviewQuestions =
      JSON.parse(qaMatch?.[1] || qaMatch?.[2] || qaMatch?.[3])
        ?.interview_questions || {};

    // Return combined result
    res.json({
      success: true,
      result: {
        introduction,
        qa: interviewQuestions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate resume report",
      details: error.response?.data || error.message,
    });
  }
};
