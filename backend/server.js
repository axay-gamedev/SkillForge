import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import analysisRouter from "./routes/analysis.js";
import skillsRouter from "./routes/skills.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(
  "/api/analyze",
  analysisRouter
);

app.use(
  "/api/skills",
  skillsRouter
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(5000, () => {
  console.log(
    "Backend running on http://localhost:5000"
  );
});