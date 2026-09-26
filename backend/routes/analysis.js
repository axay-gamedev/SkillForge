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

    if (message.includes("GEMINI_API_KEY")) {
      return res.status(500).json({
        error: "Gemini API key is not configured on the backend.",
      });
    }

    if (
      message.includes("API") ||
      message.includes("model") ||
      message.includes("quota") ||
      message.includes("permission")
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
