import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMinecraftCode(prompt: string, type: 'plugin' | 'mod', platform: string): Promise<string> {
  const systemPrompt = `You are an expert Minecraft ${type} developer. Generate high-quality, production-ready Java code for ${platform}.
  
  Guidelines:
  - Write clean, well-documented code
  - Follow ${platform} best practices
  - Include proper error handling
  - Add helpful comments
  - Ensure the code is complete and functional
  
  Platform: ${platform}
  Type: ${type}
  
  User Request: ${prompt}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: systemPrompt,
  });

  return response.text || "Failed to generate code";
}

export async function explainCode(code: string): Promise<string> {
  const prompt = `Please explain this Minecraft plugin/mod code in detail. Include:
  1. What the code does
  2. How it works
  3. Key features and functionality
  4. Setup instructions
  
  Code:
  ${code}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Failed to explain code";
}

export async function optimizeCode(code: string): Promise<string> {
  const prompt = `Optimize this Minecraft plugin/mod code for better performance, readability, and best practices:

  ${code}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
  });

  return response.text || "Failed to optimize code";
}

export async function generateCreativeIdeas(description: string): Promise<string> {
  const prompt = `Generate creative Minecraft mod/plugin ideas based on this description: ${description}
  
  Include:
  - Multiple creative concepts
  - Implementation suggestions
  - Unique features
  - Gameplay impact`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
  });

  return response.text || "Failed to generate ideas";
}
