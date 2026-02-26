import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import verifyToken from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const MAX_SUMMARY_PAYLOAD_BYTES = 1024 * 1024;
const summaryRequestTracker = new Map();

const summaryRateLimit = (req, res, next) => {
  const key = req.user?.userId || req.ip;
  const now = Date.now();
  const existing = summaryRequestTracker.get(key);

  if (!existing || now > existing.resetAt) {
    summaryRequestTracker.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return next();
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res
      .status(429)
      .json({ message: "Too many summary requests. Please try again in a minute." });
  }

  existing.count += 1;
  return next();
};

router.post("/", verifyToken, summaryRateLimit, async (req, res) => {
  const { rows, columns, columnNames, fullData } = req.body;

  const payloadSize = Buffer.byteLength(JSON.stringify(req.body || {}), "utf8");
  if (payloadSize > MAX_SUMMARY_PAYLOAD_BYTES) {
    return res.status(413).json({ message: "Request payload too large for summary generation." });
  }

  if (!Array.isArray(columnNames)) {
    return res.status(400).json({ message: "Invalid summary payload" });
  }

  // Construct prompt for AI
  const inputText = `
You are a data analyst. Analyze this dataset and provide:
1. A short description of what this dataset might represent.
2. Key insights or patterns you notice.
3. 2-3 suggestions for further analysis or visualization.

Dataset Overview:
- Total Rows: ${rows}
- Total Columns: ${columns}
- Column Names: ${columnNames.join(", ")}

Full Data:
${JSON.stringify(fullData, null, 2)}

Please do NOT include any raw rows from the dataset in your description or insights. Focus on summarizing the data's characteristics, patterns, and useful suggestions.
`;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: inputText }),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Hugging Face API error: ${errorDetails}`);
    }

    const result = await response.json();
    const rawOutput = result[0]?.generated_text || "No summary generated.";

    // We remove the prompt part and keep only the AI-generated answer
    // The AI output might contain the prompt again, so remove it

    // The prompt ends at "3. 2-3 suggestions for further analysis or visualization."
    const promptEndMarker = "3. 2-3 suggestions for further analysis or visualization.";

    let cleanOutput = rawOutput;

    const markerIndex = rawOutput.indexOf(promptEndMarker);
    if (markerIndex !== -1) {
      cleanOutput = rawOutput.substring(markerIndex + promptEndMarker.length).trim();
    }

    // Split the clean output into 3 sections based on numbered list
    // AI might return output starting with "1. description ... 2. insights ... 3. suggestions"
    // Split on lines starting with "1.", "2.", "3."
    const sections = cleanOutput
      .split(/\n[1-3]\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    // Prepare summary object
    const summaryResponse = {
      description: sections[0] || "No description found.",
      insights: sections[1] || "No insights found.",
      suggestions: sections[2] || "No suggestions found.",
    };

    // Send dataset overview separately and summary cleanly
    res.json({
      overview: {
        rows,
        columns,
        columnNames,
      },
      summary: summaryResponse,
    });
  } catch (error) {
    console.error("Error generating summary:", error.message);
    res.status(500).json({ summary: "Error generating summary." });
  }
});

export default router;
