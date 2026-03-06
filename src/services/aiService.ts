export interface AIResponse {
  code: string;
  explanation: string;
  suggestions: string[];
}

export const aiService = {
  async generate(prompt: string, language: string, context: string = ""): Promise<AIResponse> {
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language, context }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate code");
      }
      return await res.json();
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async fix(code: string, language: string): Promise<AIResponse> {
    try {
      const res = await fetch("/api/ai/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fix code");
      }
      return await res.json();
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async explain(code: string, language: string): Promise<AIResponse> {
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to explain code");
      }
      return await res.json();
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async optimize(code: string, language: string): Promise<AIResponse> {
    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to optimize code");
      }
      return await res.json();
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async convert(code: string, fromLanguage: string, toLanguage: string): Promise<AIResponse> {
    try {
      const res = await fetch("/api/ai/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, fromLanguage, toLanguage }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to convert code");
      }
      return await res.json();
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }
};
