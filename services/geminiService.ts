
import { GoogleGenAI, Type } from "@google/genai";
import { Empresa, BusinessInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBusinessInsights = async (empresas: Empresa[]): Promise<BusinessInsight> => {
  const companyContext = empresas.map(e => `- ${e.nome} (${e.setor}, ${e.localizacao})`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these companies and provide business insights:\n${companyContext}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A professional summary of the company portfolio."
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Three strategic recommendations for this group of companies."
          },
          marketAnalysis: {
            type: Type.STRING,
            description: "A brief analysis of the market sectors represented."
          }
        },
        required: ["summary", "recommendations", "marketAnalysis"]
      }
    }
  });

  return JSON.parse(response.text);
};
