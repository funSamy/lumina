import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { BrandStrategy, ChatMessage } from "../types";

// Helper to get the AI client.
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const STRATEGY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    colors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hex: { type: Type.STRING, description: "Hex color code e.g. #FF5733" },
          name: { type: Type.STRING, description: "Creative name for the color" },
          usage: { type: Type.STRING, description: "When to use this color (Primary, Accent, Background)" },
        },
        required: ["hex", "name", "usage"],
      },
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        headerFont: { type: Type.STRING, description: "Name of a popular Google Font for headers" },
        bodyFont: { type: Type.STRING, description: "Name of a popular Google Font for body text" },
        reasoning: { type: Type.STRING, description: "Why this pairing fits the brand" },
      },
      required: ["headerFont", "bodyFont", "reasoning"],
    },
    logoPrompts: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "A highly detailed, artistic image generation prompt for the primary logo. Mention style, colors, and key symbols." },
        secondary: { type: Type.STRING, description: "A detailed image generation prompt for a simplified secondary mark or icon." },
      },
      required: ["primary", "secondary"],
    },
    brandVoice: {
      type: Type.STRING,
      description: "A short description of the brand's personality and voice."
    }
  },
  required: ["colors", "typography", "logoPrompts"],
};

export const generateBrandStrategy = async (mission: string): Promise<BrandStrategy> => {
  const ai = getAiClient();
  
  const prompt = `
    You are a world-class Brand Identity Expert.
    Analyze the following company mission statement and create a cohesive brand identity foundation.
    
    MISSION:
    "${mission}"
    
    Generate:
    1. A 5-color palette (Hex codes, creative names, usage notes).
    2. A typography pairing using Google Fonts (Header + Body).
    3. Detailed image generation prompts for a Primary Logo and a Secondary Mark. The prompts should be descriptive enough for a high-quality image generator.
    4. A brief description of the brand voice.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Reasoning model for strategy
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: STRATEGY_SCHEMA,
      // Provide a good thinking budget for creative reasoning
      thinkingConfig: { thinkingBudget: 2048 }, 
      maxOutputTokens: 8192, 
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from strategy generation");
  
  return JSON.parse(text) as BrandStrategy;
};

export const generateLogoImage = async (prompt: string): Promise<string> => {
  const ai = getAiClient();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', // Switched to Nano banana for free generation
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      }
    }
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate image");
};

// Chat Service
let chatSession: Chat | null = null;

export const initChatSession = (context?: BrandStrategy) => {
  const ai = getAiClient();
  const systemInstruction = context 
    ? `You are the Brand Assistant for a company with the following identity:
       Colors: ${context.colors.map(c => c.name).join(', ')}.
       Fonts: ${context.typography.headerFont} & ${context.typography.bodyFont}.
       Voice: ${context.brandVoice}.
       Help the user refine their brand, suggest marketing copy, or explain design choices.`
    : "You are a helpful Brand Identity Assistant.";

  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
    }
  });
};

export const sendBrandChatMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    initChatSession();
  }
  
  if (!chatSession) throw new Error("Chat session not initialized");

  const response = await chatSession.sendMessage({ message });
  return response.text || "I'm having trouble thinking of a response right now.";
};