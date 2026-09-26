import express from "express";

import {
  analyzeProfile,
} from "../services/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const profile = req.body;

    if (!profile) {
      return res.status(400).json({
        error:
          "Profile is required",
      });
    }

    const analysis =
      await analyzeProfile(profile);

    res.json(analysis);

  } catch (error) {

    console.error(
      "Gemini error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to analyze profile",
    });
  }

});

export default router;