
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

// Prompt类型
export type PromptType = 'default' | 'detailed' | 'simple' | 'custom';

// 简化的用户输入（不包含API配置）
export interface BaziInput {
  name?: string;
  gender: Gender;
  birthYear: string;   // 出生年份 (如 1990)
  yearPillar: string;  // 年柱
  monthPillar: string; // 月柱
  dayPillar: string;   // 日柱
  hourPillar: string;  // 时柱
  startAge: string;    // 起运年龄 (虚岁)
  firstDaYun: string;  // 第一步大运干支
  promptType?: PromptType; // Prompt类型
  customPrompt?: string;  // 自定义Prompt（当promptType为custom时使用）
}

// 保留旧的UserInput用于向后兼容（如果还需要API调用功能）
export interface UserInput extends BaziInput {
  modelName: string;
  apiBaseUrl: string;
  apiKey: string;
}

export interface KLinePoint {
  age: number;
  year: number;
  ganZhi: string; // 当年的流年干支 (如：甲辰)
  daYun?: string; // 当前所在的大运（如：甲子大运），用于图表标记
  open: number;
  close: number;
  high: number;
  low: number;
  score: number;
  reason: string; // 这里现在需要存储详细的流年描述
}

export interface AnalysisData {
  bazi: string[]; // [Year, Month, Day, Hour] pillars
  summary: string;
  summaryScore: number; // 0-10
  
  industry: string;
  industryScore: number; // 0-10
  
  wealth: string;
  wealthScore: number; // 0-10
  
  marriage: string;
  marriageScore: number; // 0-10
  
  health: string;
  healthScore: number; // 0-10
  
  family: string;
  familyScore: number; // 0-10
}

export interface LifeDestinyResult {
  chartData: KLinePoint[];
  analysis: AnalysisData;
}
