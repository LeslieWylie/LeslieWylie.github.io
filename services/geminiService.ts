import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, LifeDestinyResult, Gender } from "../types";
import { BAZI_SYSTEM_INSTRUCTION } from "../constants";

// Schema definition for the expected JSON response
const chartPointSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    age: { type: Type.INTEGER },
    year: { type: Type.INTEGER },
    open: { type: Type.NUMBER },
    close: { type: Type.NUMBER },
    high: { type: Type.NUMBER },
    low: { type: Type.NUMBER },
    score: { type: Type.NUMBER },
    reason: { type: Type.STRING },
  },
  required: ["age", "year", "open", "close", "high", "low", "reason"],
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bazi: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    summary: { type: Type.STRING },
    industry: { type: Type.STRING },
    wealth: { type: Type.STRING },
    marriage: { type: Type.STRING },
    health: { type: Type.STRING },
    family: { type: Type.STRING },
    timeline: { type: Type.STRING },
    chartPoints: {
      type: Type.ARRAY,
      items: chartPointSchema,
    },
  },
  required: ["bazi", "summary", "industry", "wealth", "marriage", "health", "family", "timeline", "chartPoints"],
};

export const generateLifeAnalysis = async (input: UserInput): Promise<LifeDestinyResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Translate gender to Chinese for the prompt context
  const genderStr = input.gender === Gender.MALE ? '男' : '女';

  const prompt = `
    请根据以下八字信息进行分析：
    性别：${genderStr}
    出生日期：${input.birthDate}
    出生时间：${input.birthTime}
    出生地：${input.birthPlace}
    
    姓名（可选）：${input.name || "未提供"}
    
    请严格按照系统指令生成人生K线数据和命理分析。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        systemInstruction: BAZI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("模型未返回数据。");
    }

    const data = JSON.parse(text);

    return {
      chartData: data.chartPoints,
      analysis: {
        bazi: data.bazi,
        summary: data.summary,
        industry: data.industry,
        wealth: data.wealth,
        marriage: data.marriage,
        health: data.health,
        family: data.family,
        timeline: data.timeline,
      },
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
