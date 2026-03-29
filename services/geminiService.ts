
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const BTP_EMAIL_SYSTEM_INSTRUCTION = `
You are an AI Sales & Operations Assistant specialized in the BTP and construction materials sector (PVC, HDPE, drainage, Potable water networks, etc.).
Your mission is to read and classify incoming emails and reply ONLY in professional French.
RULES:
1. Classification: Identify if it's a Price request, Technical question, Follow-up, or Negotiation.
2. Reply strictly in professional French. 
3. Never invent prices or delivery dates. Ask for missing info (quantities, delivery location) if needed.
4. Maintain a serious B2B tone. No emojis.
5. Sales Closing: Encourage the next step (propose quotation, suggest call/meeting).
6. Be efficient, proactive, and business-oriented.
`;

const BTP_IMAGE_SYSTEM_INSTRUCTION = `
You are an expert in industrial product photography for the BTP sector.
Your goal is to optimize photos of construction materials (pipes, conduits, VRD installations).
RULES:
1. Maintain strict industrial realism. No artistic or fake effects.
2. Focus on technical clarity, lighting, sharpness, and correct perspective.
3. Optimized for technical catalogs, quotations, and B2B LinkedIn posts.
`;

export const generateEmailDraft = async (emailBody: string, tone: string = 'professional'): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Draft a reply to this email: \n\n${emailBody}`,
    config: {
      systemInstruction: BTP_EMAIL_SYSTEM_INSTRUCTION,
      temperature: 0.4, // Lower temperature for more consistent B2B tone
      topP: 0.9,
    }
  });
  return response.text || "Erreur lors de la génération du brouillon.";
};

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${prompt}. BTP industrial setting, high realism, professional construction photography.` }]
      },
      config: {
        systemInstruction: BTP_IMAGE_SYSTEM_INSTRUCTION,
        imageConfig: {
          aspectRatio,
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
  return null;
};

export const editImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  const base64Data = base64Image.split(',')[1] || base64Image;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: `Enhance this BTP product photo: ${prompt}. Focus on industrial realism and technical clarity.`,
          },
        ],
      },
      config: {
        systemInstruction: BTP_IMAGE_SYSTEM_INSTRUCTION
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error editing image:", error);
  }
  return null;
};
