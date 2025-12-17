
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

// Prompt类型
export type PromptType = 'default' | 'detailed' | 'custom' | 'detailed_v2' | 'detailed_v3' | 'detailed_v4';

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

// K线趋势类型
export type TrendType = 'Bullish' | 'Bearish';

// 十神类型
export type TenGodType = '正官' | '偏官' | '正财' | '偏财' | '正印' | '偏印' | '食神' | '伤官' | '比肩' | '劫财';

// 标签类型
export type ForecastTag = 'Career' | 'Wealth' | 'Love' | 'Health' | 'Study' | 'Safety' | 'Travel' | 'Family';

// 五行类型
export type ElementType = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

// V2 格式的 K线数据
export interface KLineData {
  open: number;
  close: number;
  high: number;
  low: number;
  trend: TrendType;
}

// V2 格式的命理数据
export interface MetaphysicsData {
  daYun: string;
  ganZhi: string;
  tenGod?: TenGodType;
  interaction?: string[]; // 冲合关系
  shenSha?: string[]; // 神煞
  energy?: ElementType; // 最旺五行
}

// V2 格式的预测数据
export interface ForecastData {
  title: string; // 年度概括
  content: string; // 详细批断
  tags?: ForecastTag[];
  advice?: string; // 改运建议
  luckyColor?: string;
  luckyDirection?: string;
}

// V2 格式的时间轴数据点
export interface TimelinePoint {
  index: number;
  age: number;
  year: number;
  kLine: KLineData;
  metaphysics: MetaphysicsData;
  forecast: ForecastData;
}

// 旧格式的 K线数据点（向后兼容）
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
  // V2 格式的扩展字段（可选，用于兼容）
  trend?: TrendType;
  tenGod?: TenGodType;
  interaction?: string[];
  shenSha?: string[];
  energy?: ElementType;
  title?: string;
  tags?: ForecastTag[];
  advice?: string;
  luckyColor?: string;
  luckyDirection?: string;
}

// 四柱详细信息
export interface PillarInfo {
  ganZhi: string;
  naYin?: string; // 纳音
  shenSha?: string[]; // 神煞
}

// 原局分析
export interface BaseChartAnalysis {
  pattern?: string; // 格局名称
  strongWeak?: string; // 身强/身弱
  xiYong?: string[]; // 喜用神
  jiChou?: string[]; // 忌仇神
  missing?: string[]; // 缺失五行
}

// 五行能量分布
export interface ElementDistribution {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

// V2 格式的基础图表数据
export interface BaseChart {
  pillars: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo;
  };
  analysis: BaseChartAnalysis;
  elementDistribution?: ElementDistribution;
}

// V2 格式的全局维度评分
export interface GlobalDimensions {
  summary: string;
  scores: {
    total: number;
    career: number;
    wealth: number;
    marriage: number;
    health: number;
    children: number;
  };
}

// V2 格式的元数据
export interface MetaData {
  version?: string;
  generator?: string;
  calendarSystem?: string;
}

// V2 格式的完整结果
export interface LifeDestinyResultV2 {
  meta?: MetaData;
  baseChart: BaseChart;
  globalDimensions: GlobalDimensions;
  timeline: TimelinePoint[];
}

// 旧格式的分析数据（向后兼容）
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

// V4 格式的命理逻辑分析
export interface BaziLogic {
  essence: string; // 日主特性与调候深度分析
  hidden_virtuality: string; // 虚神推导过程与结果
  system_validation: string; // 格局与用神多角度交叉结论
  mang_pai_work: string; // 体用派系划分及地支做功详述
  destiny_story: string; // 象法化的人生描述
  comprehensive_stats: {
    appearance: string; // 形象描述
    mission: string; // 天赋使命
    wealth_cap: string; // 财富量级与上限
    marriage_fate: string; // 感情宿命论断
  };
}

// V4 格式的历史验证点
export interface HistoryCheckpoint {
  year: number;
  event: string;
  logic: string; // 命理学应期解释
}

// V4 格式的评分
export interface V4Scores {
  summary: number; // 0-10
  career: number; // 0-10
  wealth: number; // 0-10
  marriage: number; // 0-10
  health: number; // 0-10
}

// V4 格式的 K线数据点
export interface V4ChartPoint {
  age: number;
  year: number;
  daYun: string; // 当前大运
  ganZhi: string; // 流年干支
  k_line: {
    open: number; // 0-100
    close: number; // 0-100
    high: number; // 0-100
    low: number; // 0-100
  };
  score: number; // 0-100
  reason: string; // 100字详批
}

// V4 格式的完整结果
export interface LifeDestinyResultV4 {
  bazi_logic: BaziLogic;
  history_checkpoints: HistoryCheckpoint[];
  scores: V4Scores;
  chartPoints: V4ChartPoint[];
}

// 统一的结果接口（兼容新旧格式）
export interface LifeDestinyResult {
  chartData: KLinePoint[]; // 统一转换为 KLinePoint 格式
  analysis: AnalysisData; // 兼容旧格式
  // V2 格式的扩展数据（可选）
  v2Data?: LifeDestinyResultV2;
  // V3 扩展信息（当前主要用于前端展示，不参与严格验证）
  v3Extras?: {
    summaryOverview?: any;
    futureFocus?: any;
    share?: any;
    profile?: any;
  };
  // V4 扩展信息
  v4Extras?: LifeDestinyResultV4;
  // 用户姓名（用于显示）
  userName?: string;
}
