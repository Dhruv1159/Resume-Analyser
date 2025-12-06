// controllers/resumeController.js
import axios from "axios";
import { parseResumeFile } from "../utils/fileParser.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const analyzeResume = async (req, res) => {
  try {
    const { jobRole } = req.body;
    const filePath = req.file.path;
    const mimetype = req.file.mimetype;

    const resumeText = await parseResumeFile(filePath, mimetype);
    fs.unlinkSync(filePath);

    const prompt = `
      Analyze the following resume for the role of ${jobRole}.
      Give output strictly in JSON format:
      {
        "recommendations": [],
        "score": number between 0 and 100,
        "summary": "brief overall evaluation"
      }
      Resume text:
      ${resumeText}
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Resume Analyzer",
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    const jsonMatch = aiResponse.match(
      /```json([\s\S]*?)```|```([\s\S]*?)```|(\{[\s\S]*\})/
    );
    const result = JSON.parse(
      jsonMatch?.[1] || jsonMatch?.[2] || jsonMatch?.[3]
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      error: "Failed to analyze resume",
      details: error.response?.data || error.message,
    });
  }
};
