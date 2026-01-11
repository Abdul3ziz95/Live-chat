
import { GoogleGenAI, Type } from "@google/genai";
import { MessageTone } from "../types";

export const generateSmartMessage = async (topic: string, tone: MessageTone): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      أريد كتابة رسالة واتساب باللغة العربية.
      الموضوع: ${topic}
      الأسلوب (Tone): ${tone}
      
      المتطلبات:
      - يجب أن تكون الرسالة قصيرة ومناسبة للواتساب.
      - لا تضف أي نص خارج الرسالة.
      - استخدم الإيموجي المناسب بشكل بسيط.
      - إذا كان الأسلوب "professional"، اجعلها رسمية ومهذبة.
      - إذا كان "friendly"، اجعلها ودودة.
      - إذا كان "funny"، اجعلها ممتعة وخفيفة الظل.
      - إذا كان "short"، اجعلها مباشرة جداً.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "مرحباً، أود التواصل معك.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "مرحباً، أود التواصل معك.";
  }
};
