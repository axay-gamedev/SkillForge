import {
  GoogleGenAI,
} from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeProfile =
  async (profile) => {

    const response =
      await ai.models.generateContent({

        model: "gemini-3.8-flash",

        contents: `
You are SkillForge, an AI career and
learning advisor.

Analyze the student's profile and create
a personalized learning plan.

Do not invent information.

Consider:
- education level
- current year
- grades
- target role
- existing skills
- projects
- experience

The roadmap must be appropriate for the
student's current level.

Student profile:

${JSON.stringify(
  profile,
  null,
  2
)}
`,

        config: {
          responseMimeType:
            "application/json",

          responseSchema: {
            type: "object",

            properties: {

              careerReadiness: {
                type: "integer",
              },

              summary: {
                type: "string",
              },

              strengths: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              skillGaps: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              skillAnalysis: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    name: {
                      type: "string",
                    },

                    level: {
                      type: "integer",
                    },

                    status: {
                      type: "string",
                    },
                  },

                  required: [
                    "name",
                    "level",
                    "status",
                  ],
                },
              },

              estimatedWeeks: {
                type: "integer",
              },

              roadmap: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    week: {
                      type: "integer",
                    },

                    title: {
                      type: "string",
                    },

                    description: {
                      type: "string",
                    },
                  },

                  required: [
                    "week",
                    "title",
                    "description",
                  ],
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

    return JSON.parse(
      response.text
    );
  };