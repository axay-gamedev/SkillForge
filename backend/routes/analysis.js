import express from "express";

import { analyzeProfile } from "../services/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const profile = req.body;

    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      return res.status(400).json({
        error: "A valid profile object is required",
      });
    }

    const analysis = await analyzeProfile(profile);
    return res.json(analysis);
  } catch (error) {
    console.error("Gemini analysis error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    const normalized = message.toLowerCase();

    if (message.includes("GEMINI_API_KEY")) {
      return res.status(500).json({
        error: "Gemini API key is not configured on the backend.",
      });
    }

    if (
      normalized.includes("high demand") ||
      normalized.includes("temporarily unavailable") ||
      normalized.includes("unavailable") ||
      normalized.includes("rate limit") ||
      normalized.includes("too many requests")
    ) {
      return res.status(503).json({
        error: "Gemini is temporarily busy. Please try again in a few seconds.",
        retryable: true,
      });
    }

    if (
      normalized.includes("api") ||
      normalized.includes("model") ||
      normalized.includes("quota") ||
      normalized.includes("permission")
    ) {
      return res.status(502).json({
        error: "Gemini could not process the analysis request.",
      });
    }

    return res.status(500).json({
      error: "Failed to analyze profile",
    });
  }
});

export default router;
