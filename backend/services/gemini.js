import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const analyzeProfile = async (profile) => {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `You are SkillForge, an AI career and learning advisor.

Analyze the student's profile and create a realistic personalized learning plan.
Do not invent qualifications, experience, skills, projects, or achievements.
Base the assessment on the supplied profile. Keep recommendations appropriate to the student's current education level and target role.

Student profile:
${JSON.stringify(profile, null, 2)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  let analysis;
  try {
    analysis = JSON.parse(response.text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  if (
    typeof analysis.careerReadiness !== "number" ||
    !Array.isArray(analysis.skillAnalysis) ||
    !Array.isArray(analysis.roadmap)
  ) {
    throw new Error("Gemini returned an invalid analysis structure");
  }

  analysis.careerReadiness = Math.max(0, Math.min(100, analysis.careerReadiness));
  analysis.skillAnalysis = analysis.skillAnalysis.map((skill) => ({
    ...skill,
    level: Math.max(0, Math.min(100, Number(skill.level) || 0)),
  }));
  analysis.roadmap = analysis.roadmap.map((item, index) => ({
    ...item,
    week: Number(item.week) || index + 1,
    status: item.status || (index === 0 ? "Current" : "Upcoming"),
  }));

  return analysis;
};
