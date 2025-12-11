import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStyleRecommendations = async (
  faceShape: string,
  hairType: string,
  lifestyle: string
): Promise<AIRecommendation[]> => {
  try {
    const prompt = `
      Atue como um barbeiro especialista e consultor de imagem.
      Sugira 3 estilos de corte de cabelo e barba para um cliente com as seguintes características:
      - Formato do rosto: ${faceShape}
      - Tipo de cabelo: ${hairType}
      - Estilo de vida/Preferência: ${lifestyle}

      Para cada estilo, forneça o nome, uma breve descrição técnica de como fazer, nível de manutenção (Baixo, Médio, Alto) e produtos recomendados.
      Retorne APENAS o JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              styleName: { type: Type.STRING },
              description: { type: Type.STRING },
              maintenanceLevel: { type: Type.STRING },
              products: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

export const generateMarketingMessage = async (clientName: string, lastVisit: string, preferences: string): Promise<string> => {
  try {
    // Calculate days since last visit simply for the prompt context
    const visitDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - visitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const timeContext = diffDays > 30 ? "Faz mais de um mês que ele não vem." : "Faz algumas semanas que ele veio.";

    const prompt = `
      Atue como um barbeiro profissional e amigo. 
      Crie uma mensagem curta de WhatsApp para o cliente ${clientName}.
      
      Contexto:
      - ${timeContext}
      - Preferências do cliente: ${preferences}
      
      Objetivo: Reengajar o cliente sugerindo agendar um serviço (corte ou barba) de forma natural.
      Tom: Descontraído, use emojis, não pareça um robô. Máximo de 2 frases.
      
      Retorne APENAS o texto da mensagem.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || "";
  } catch (error) {
    return `Fala ${clientName}! 💈 Já faz um tempo desde seu último corte. Que tal agendar um horário para renovar o visual?`;
  }
}