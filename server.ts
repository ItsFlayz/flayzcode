import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper function for AI calls
  const callAI = async (systemInstruction: string, prompt: string) => {
    const model = "gemini-3-flash-preview";
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              explanation: { type: Type.STRING },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["code", "explanation", "suggestions"]
          }
        }
      });
      
      if (!response.text) {
        throw new Error("Empty response from AI");
      }
      
      return JSON.parse(response.text);
    } catch (error: any) {
      console.error("AI Error:", error);
      throw error;
    }
  };

  // API Routes
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt, language, context } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    
    const systemInstruction = `You are an expert ${language || 'software'} developer. Generate clean, optimized code. Context of current file: ${context || 'None'}`;
    try {
      const result = await callAI(systemInstruction, prompt);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "AI generation failed" });
    }
  });

  app.post("/api/ai/fix", async (req, res) => {
    const { code, language } = req.body;
    const systemInstruction = `You are an expert ${language} developer. Detect syntax and logical errors in the provided code and fix them. Return the fixed code, explanation of fixes, and further suggestions.`;
    try {
      const result = await callAI(systemInstruction, code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "AI fix failed" });
    }
  });

  app.post("/api/ai/explain", async (req, res) => {
    const { code, language } = req.body;
    const systemInstruction = `You are a coding tutor. Provide a beginner-friendly, line-by-line explanation of the following ${language} code.`;
    try {
      const result = await callAI(systemInstruction, code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "AI explanation failed" });
    }
  });

  app.post("/api/ai/optimize", async (req, res) => {
    const { code, language } = req.body;
    const systemInstruction = `You are a performance engineer. Optimize the following ${language} code for speed and readability.`;
    try {
      const result = await callAI(systemInstruction, code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "AI optimization failed" });
    }
  });

  app.post("/api/ai/convert", async (req, res) => {
    const { code, fromLanguage, toLanguage } = req.body;
    const systemInstruction = `Convert the following code from ${fromLanguage} to ${toLanguage}. Ensure idiomatic patterns in the target language.`;
    try {
      const result = await callAI(systemInstruction, code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "AI conversion failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
