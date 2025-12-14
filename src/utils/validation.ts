import { z } from 'zod';

// 天干列表
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支列表
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 验证干支格式
const ganZhiSchema = z.string().refine(
  (val) => {
    if (!val || val.length !== 2) return false;
    const [gan, zhi] = val.split('');
    return TIAN_GAN.includes(gan) && DI_ZHI.includes(zhi);
  },
  { message: '请输入正确的干支格式（如：甲子）' }
);

// BaziInput 验证 Schema
export const baziInputSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(['Male', 'Female']),
  birthYear: z.string()
    .min(1, '请输入出生年份')
    .refine((val) => {
      const year = parseInt(val);
      return !isNaN(year) && year >= 1900 && year <= 2100;
    }, { message: '出生年份应在 1900-2100 之间' }),
  yearPillar: ganZhiSchema,
  monthPillar: ganZhiSchema,
  dayPillar: ganZhiSchema,
  hourPillar: ganZhiSchema,
  startAge: z.string()
    .min(1, '请输入起运年龄')
    .refine((val) => {
      const age = parseInt(val);
      return !isNaN(age) && age >= 1 && age <= 100;
    }, { message: '起运年龄应在 1-100 之间' }),
  firstDaYun: ganZhiSchema,
  promptType: z.enum(['default', 'detailed', 'simple', 'custom']).optional(),
  customPrompt: z.string().optional(),
});

// K线数据点验证 Schema
export const kLinePointSchema = z.object({
  age: z.number().int().min(1).max(100),
  year: z.number().int().min(1900).max(2100),
  ganZhi: ganZhiSchema,
  daYun: z.string().optional(),
  open: z.number().min(0).max(100),
  close: z.number().min(0).max(100),
  high: z.number().min(0).max(100),
  low: z.number().min(0).max(100),
  score: z.number().min(0).max(100),
  reason: z.string().min(10, '流年详批至少需要10个字符'),
});

// 分析数据验证 Schema
export const analysisDataSchema = z.object({
  bazi: z.array(z.string()).length(4),
  summary: z.string().min(1),
  summaryScore: z.number().min(0).max(10),
  industry: z.string().min(1),
  industryScore: z.number().min(0).max(10),
  wealth: z.string().min(1),
  wealthScore: z.number().min(0).max(10),
  marriage: z.string().min(1),
  marriageScore: z.number().min(0).max(10),
  health: z.string().min(1),
  healthScore: z.number().min(0).max(10),
  family: z.string().min(1),
  familyScore: z.number().min(0).max(10),
});

// 完整结果验证 Schema
export const lifeDestinyResultSchema = z.object({
  chartData: z.array(kLinePointSchema).length(100),
  analysis: analysisDataSchema,
});

// 类型导出
export type BaziInputFormData = z.infer<typeof baziInputSchema>;
export type ValidatedLifeDestinyResult = z.infer<typeof lifeDestinyResultSchema>;

// 验证函数
export const validateBaziInput = (data: unknown) => {
  return baziInputSchema.safeParse(data);
};

export const validateLifeDestinyResult = (data: unknown) => {
  return lifeDestinyResultSchema.safeParse(data);
};

// 获取验证错误信息（友好格式）
export const getValidationErrors = (error: z.ZodError | unknown): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // 检查是否是 ZodError
  if (error && typeof error === 'object' && 'errors' in error) {
    const zodError = error as z.ZodError;
    if (Array.isArray(zodError.errors)) {
      zodError.errors.forEach((err) => {
        const path = err.path ? err.path.join('.') : 'unknown';
        errors[path] = err.message || '验证失败';
      });
    }
  } else {
    // 如果不是 ZodError，返回通用错误
    errors['general'] = error instanceof Error ? error.message : '数据验证失败';
  }
  
  return errors;
};

