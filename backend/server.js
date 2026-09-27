import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import analysisRouter from "./routes/analysis.js";
import skillsRouter from "./routes/skills.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL.split(",").map((origin) => origin.trim()),
  })
);

app.use(express.json({ limit: "1mb" }));

app.use("/api/analyze", analysisRouter);
app.use("/api/skills", skillsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

export default app;
