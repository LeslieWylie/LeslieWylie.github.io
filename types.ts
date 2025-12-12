export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export interface UserInput {
  name?: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
}

export interface KLinePoint {
  age: number;
  year: number;
  open: number;
  close: number;
  high: number;
  low: number;
  score: number; // Normalized 0-100 score for simpler logic if needed
  reason: string;
}

export interface AnalysisData {
  bazi: string[]; // [Year, Month, Day, Hour] pillars
  summary: string;
  industry: string;
  wealth: string;
  marriage: string;
  health: string;
  family: string;
  timeline: string; // Markdown content
}

export interface LifeDestinyResult {
  chartData: KLinePoint[];
  analysis: AnalysisData;
}
