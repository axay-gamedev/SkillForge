import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    const params = new URLSearchParams({
      text: query,
      language: "en",
      type: "Skill",
      limit: "8",
      full: "false",
    });

    const response = await fetch(
      `https://ec.europa.eu/esco/api/search?${params}`
    );

    if (!response.ok) {
      throw new Error(
        "ESCO request failed"
      );
    }

    const data = await response.json();

    const results =
      data._embedded?.results || [];

    const skills = results.map(
      (item) => ({
        name:
          item.preferredLabel ||
          item.title ||
          item.label,
        uri: item.uri,
      })
    );

    res.json(skills);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to fetch skills",
    });
  }
});

export default router;