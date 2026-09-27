import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Create backend/.env with GEMINI_API_KEY=your_key."
    );
  }

  return new GoogleGenAI({ apiKey });
};

const responseSchema = {
  type: "object",
  properties: {
    careerReadiness: { type: "integer" },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    skillGaps: { type: "array", items: { type: "string" } },
    skillAnalysis: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          level: { type: "integer" },
          status: { type: "string" },
        },
        required: ["name", "level", "status"],
      },
    },
    estimatedWeeks: { type: "integer" },
    roadmap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          week: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string" },
        },
        required: ["week", "title", "description", "status"],
      },
    },
  },
  required: [
    "careerReadiness",
    "summary",
    "strengths",
    "skillGaps",
    "skillAnalysis",
    "estimatedWeeks",
    "roadmap",
  ],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTemporaryError = (error) => {
  const status = error?.status || error?.code;
  const message = String(error?.message || "").toLowerCase();

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("high demand") ||
    message.includes("temporarily unavailable") ||
    message.includes("unavailable")
  );
};

const generateWithModel = async (ai, model, contents) => {
  let lastError;

  // A short retry handles temporary capacity spikes without making the user
  // wait through a long retry sequence.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        },
      });
    } catch (error) {
      lastError = error;

      if (!isTemporaryError(error) || attempt === 1) {
        throw error;
      }

      await sleep(1200);
    }
  }

  throw lastError;
};

export const analyzeProfile = async (profile) => {
  const ai = getClient();

  const contents = `You are SkillForge, an AI career and learning advisor.

Analyze the student's profile and create a realistic personalized learning plan.
Do not invent qualifications, experience, skills, projects, or achievements.
Base the assessment on the supplied profile. Keep recommendations appropriate to the student's current education level and target role.

Student profile:
${JSON.stringify(profile, null, 2)}`;

  // Gemini 3.8 Flash is the primary model. Google currently lists 3.7, 3.6,
  // and 3.5 Flash as stable alternatives, so automatically fail over during
  // temporary capacity spikes.
  const models = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
  ];

  let response;
  let lastError;

  for (const model of models) {
    try {
      response = await generateWithModel(ai, model, contents);
      break;
    } catch (error) {
      lastError = error;

      // Only fail over for temporary capacity/rate-limit problems.
      // Configuration, authentication, and malformed-request errors should
      // still be surfaced immediately.
      if (!isTemporaryError(error)) {
        throw error;
      }

      console.warn(`Gemini model ${model} unavailable; trying fallback model.`);
    }
  }

  if (!response) {
    throw lastError || new Error("All Gemini models are temporarily unavailable");
  }

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  let analysis;

  try {
    analysis = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  if (
    typeof analysis.careerReadiness !== "number" ||
    typeof analysis.summary !== "string" ||
    !Array.isArray(analysis.strengths) ||
    !Array.isArray(analysis.skillGaps) ||
    !Array.isArray(analysis.skillAnalysis) ||
    !Array.isArray(analysis.roadmap)
  ) {
    throw new Error("Gemini returned an invalid analysis structure");
  }

  analysis.careerReadiness = Math.max(
    0,
    Math.min(100, analysis.careerReadiness)
  );

  analysis.skillAnalysis = analysis.skillAnalysis.map((skill) => ({
    name: String(skill.name || "Unknown skill"),
    level: Math.max(0, Math.min(100, Number(skill.level) || 0)),
    status: String(skill.status || "Developing"),
  }));

  analysis.roadmap = analysis.roadmap.map((item, index) => ({
    week: Number(item.week) || index + 1,
    title: String(item.title || `Learning milestone ${index + 1}`),
    description: String(item.description || ""),
    status: String(item.status || (index === 0 ? "Current" : "Upcoming")),
  }));

  analysis.estimatedWeeks =
    Number(analysis.estimatedWeeks) || analysis.roadmap.length;

  return analysis;
};
