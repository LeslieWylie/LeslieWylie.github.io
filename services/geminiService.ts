import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, LifeDestinyResult, Gender } from "../types";
import { BAZI_SYSTEM_INSTRUCTION } from "../constants";

// TODO: 请在此处填入您的 API KEY
const API_KEY = "AIzaSyB443oIg3LmEC9HYCWuU0AAV5x4G1Oq5Dw"; 

// Schema definition for the expected JSON response
const chartPointSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    age: { type: Type.INTEGER },
    year: { type: Type.INTEGER },
    daYun: { type: Type.STRING, description: "The MAJOR 10-YEAR PILLAR name. MUST remain constant for 10 years." },
    ganZhi: { type: Type.STRING, description: "The ANNUAL Flow Year Pillar (流年干支) for this specific year." },
    open: { type: Type.NUMBER },
    close: { type: Type.NUMBER },
    high: { type: Type.NUMBER },
    low: { type: Type.NUMBER },
    score: { type: Type.NUMBER },
    reason: { type: Type.STRING, description: "Detailed detailed forecast for this specific year" },
  },
  required: ["age", "year", "daYun", "ganZhi", "open", "close", "high", "low", "reason"],
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bazi: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    summary: { type: Type.STRING },
    summaryScore: { type: Type.INTEGER },
    
    industry: { type: Type.STRING },
    industryScore: { type: Type.INTEGER },
    
    wealth: { type: Type.STRING },
    wealthScore: { type: Type.INTEGER },
    
    marriage: { type: Type.STRING },
    marriageScore: { type: Type.INTEGER },
    
    health: { type: Type.STRING },
    healthScore: { type: Type.INTEGER },
    
    family: { type: Type.STRING },
    familyScore: { type: Type.INTEGER },
    
    chartPoints: {
      type: Type.ARRAY,
      items: chartPointSchema,
    },
  },
  required: [
    "bazi", 
    "summary", "summaryScore",
    "industry", "industryScore",
    "wealth", "wealthScore",
    "marriage", "marriageScore",
    "health", "healthScore",
    "family", "familyScore",
    "chartPoints"
  ],
};

// Helper to determine stem polarity
const getStemPolarity = (pillar: string): 'YANG' | 'YIN' => {
  if (!pillar) return 'YANG'; // default
  const firstChar = pillar.trim().charAt(0);
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  const yinStems = ['乙', '丁', '己', '辛', '癸'];
  
  if (yangStems.includes(firstChar)) return 'YANG';
  if (yinStems.includes(firstChar)) return 'YIN';
  return 'YANG'; // fallback
};

export const generateLifeAnalysis = async (input: UserInput): Promise<LifeDestinyResult> => {
  
  if (!API_KEY || API_KEY.includes("在这里填入")) {
    console.error("Config Error: API_KEY not set in geminiService.ts");
    throw new Error("请在 services/geminiService.ts 文件中填入您的 API KEY。");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const genderStr = input.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)';
  const startAgeInt = parseInt(input.startAge) || 1;
  
  // Calculate Da Yun Direction accurately
  // Rule: 
  // - Yang Year Male OR Yin Year Female -> Forward (顺行)
  // - Yin Year Male OR Yang Year Female -> Backward (逆行)
  const yearStemPolarity = getStemPolarity(input.yearPillar);
  let isForward = false;

  if (input.gender === Gender.MALE) {
    isForward = yearStemPolarity === 'YANG';
  } else {
    isForward = yearStemPolarity === 'YIN';
  }

  const daYunDirectionStr = isForward ? '顺行 (Forward)' : '逆行 (Backward)';

  // Explicit calculation example for the prompt to ensure model understands
  const directionExample = isForward 
    ? "例如：第一步是【戊申】，第二步则是【己酉】（顺排）" 
    : "例如：第一步是【戊申】，第二步则是【丁未】（逆排）";

  const prompt = `
    请根据以下**已经排好的**八字四柱和**指定的大运信息**进行分析。
    
    【基本信息】
    性别：${genderStr}
    姓名：${input.name || "未提供"}
    出生年份：${input.birthYear}年 (阳历)
    
    【八字四柱】
    年柱：${input.yearPillar} (天干属性：${yearStemPolarity === 'YANG' ? '阳' : '阴'})
    月柱：${input.monthPillar}
    日柱：${input.dayPillar}
    时柱：${input.hourPillar}
    
    【大运核心参数】
    1. 起运年龄：${input.startAge} 岁 (虚岁)。
    2. 第一步大运：${input.firstDaYun}。
    3. **排序方向**：${daYunDirectionStr}。
    
    【必须执行的算法 - 大运序列生成】
    请严格按照以下步骤生成数据：
    
    1. **锁定第一步**：确认【${input.firstDaYun}】为第一步大运。
    2. **计算序列**：根据六十甲子顺序和方向（${daYunDirectionStr}），推算出接下来的 9 步大运。
       ${directionExample}
    3. **填充 JSON**：
       - Age 1 到 ${startAgeInt - 1}: daYun = "童限"
       - Age ${startAgeInt} 到 ${startAgeInt + 9}: daYun = [第1步大运: ${input.firstDaYun}]
       - Age ${startAgeInt + 10} 到 ${startAgeInt + 19}: daYun = [第2步大运]
       - Age ${startAgeInt + 20} 到 ${startAgeInt + 29}: daYun = [第3步大运]
       - ...以此类推直到 100 岁。
    
    【特别警告】
    - **daYun 字段**：必须填大运干支（10年一变），**绝对不要**填流年干支。
    - **ganZhi 字段**：填入该年份的**流年干支**（每年一变，例如 2024=甲辰，2025=乙巳）。
    
    任务：
    1. 确认格局与喜忌。
    2. 生成 **1-100 岁 (虚岁)** 的人生流年K线数据。
    3. 在 \`reason\` 字段中提供流年详批。
    4. 生成带评分的命理分析报告。
    
    请严格按照系统指令生成 JSON 数据。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", 
      contents: prompt,
      config: {
        systemInstruction: BAZI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 16384 },
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
        summaryScore: data.summaryScore,
        industry: data.industry,
        industryScore: data.industryScore,
        wealth: data.wealth,
        wealthScore: data.wealthScore,
        marriage: data.marriage,
        marriageScore: data.marriageScore,
        health: data.health,
        healthScore: data.healthScore,
        family: data.family,
        familyScore: data.familyScore,
      },
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};