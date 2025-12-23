# 人生 K 线项目 - 完整技术栈与产品文档

> **项目地址**：https://lesliewylie.github.io  
> **GitHub**：https://github.com/LeslieWylie/LeslieWylie.github.io  
> **技术栈**：React 19 + TypeScript + Vite + Tailwind CSS + Recharts + Supabase

---

## 📑 目录

1. [项目概述](#一项目概述)
2. [产品需求文档（PRD）](#二产品需求文档prd)
3. [最小MVP定义](#三最小mvp定义)
4. [技术栈深度解析](#四技术栈深度解析)
5. [核心功能实现细节](#五核心功能实现细节)
6. [架构设计](#六架构设计)
7. [数据流与状态管理](#七数据流与状态管理)
8. [性能优化实践](#八性能优化实践)
9. [面试回答要点](#九面试回答要点)

---

## 一、项目概述

### 1.1 项目定位

**人生 K 线**是一个创新的命理可视化工具，将传统八字命理学与现代金融 K 线图技术相结合。通过 AI 大模型分析用户的生辰八字，生成 100 年的人生运势 K 线图，帮助用户以直观的方式了解人生起伏、把握关键转折点。

### 1.2 核心价值主张

- **降低使用门槛**：将复杂的排盘流程简化为 3 步操作
- **可视化趋势**：用 K 线图展示人生运势，直观易懂
- **多维度分析**：从总评、事业、财富、感情、健康、六亲等维度全面分析
- **数据驱动迭代**：通过埋点和反馈持续优化产品

### 1.3 目标用户

- **主要用户**：对命理感兴趣的技术从业者、命理爱好者
- **次要用户**：希望了解人生规划的用户
- **使用场景**：个人命理分析、人生规划参考、文化研究

---

## 二、产品需求文档（PRD）

### 2.1 产品背景

#### 2.1.1 市场痛点

传统命理工具存在三大痛点：

1. **输入繁琐**：排盘步骤复杂，需要理解干支、大运等概念
2. **结果抽象**：输出以长文为主，缺少趋势视角，难以比较不同阶段
3. **结果难保存/复盘**：缺少结构化存储和历史对比功能

#### 2.1.2 解决方案

- **简化流程**：3 步主路径（填八字 → 生成 Prompt → 上传 JSON）
- **可视化展示**：K 线图展示 100 年运势走势
- **多维度拆分**：6 大维度评分体系
- **数据持久化**：支持 JSON/PNG/PDF 导出，本地存储历史记录

### 2.2 功能需求

#### 2.2.1 核心功能（P0 - 必须实现）

**F1：八字输入表单**
- 输入字段：姓名（可选）、性别、出生年份、四柱干支、起运年龄、第一步大运
- 自动计算：大运排序方向（顺行/逆行）
- 验证规则：干支格式验证、年份范围验证（1900-2100）

**F2：Prompt 生成**
- 支持多种 Prompt 类型：default、detailed、detailed_v2、detailed_v3、detailed_v4
- 生成双段式 Prompt：系统角色设定 + 用户提示词
- 一键复制功能：分别复制系统提示、用户提示、完整对话

**F3：文件上传与数据解析**
- 支持拖拽上传 JSON 文件
- 支持粘贴 JSON 文本
- 自动识别数据格式版本（V1/V2/V3/V4）
- 数据格式转换和验证

**F4：K 线图可视化**
- 100 年运势 K 线图展示
- 支持缩放、筛选、关键年份标注
- 点击 K 线查看详细流年批断
- 大运分界线自动标注

**F5：多维度分析**
- 6 个维度评分展示（总评、事业、财富、婚姻、健康、六亲）
- 多维度 K 线图（各维度趋势曲线）
- 统计分析面板（平均值、最高/最低年份）

#### 2.2.2 重要功能（P1 - 应该实现）

**F6：历史记录**
- 本地存储历史记录（localStorage）
- 历史记录面板展示
- 一键加载历史记录

**F7：数据导出**
- 导出 JSON 格式
- 导出 PNG 图片
- 导出 PDF 报告

**F8：使用日志（可选）**
- 前端埋点上报
- 后端存储到 Supabase
- 记录核心操作：生成 Prompt、上传结果、查看历史等

#### 2.2.3 增强功能（P2 - 可以延后）

**F9：多维度 K 线图**
- 各维度趋势曲线对比
- 维度开关控制
- 平均分参考线

**F10：版本更新公告**
- 首次访问弹窗
- localStorage 记录已读状态
- 引导用户填写问卷

### 2.3 非功能需求

#### 2.3.1 性能要求
- 首屏加载时间 < 2s
- 图表渲染流畅（60fps）
- 支持 100 个数据点流畅交互

#### 2.3.2 兼容性要求
- 支持现代浏览器（Chrome、Firefox、Edge、Safari）
- 响应式设计，支持移动端访问
- 支持触摸操作（缩放、滑动）

#### 2.3.3 可用性要求
- 3 步主流程，降低学习成本
- 友好的错误提示
- 详细的使用帮助文档

---

## 三、最小MVP定义

### 3.1 MVP 目标

**核心目标**：验证"将命理结果可视化"的核心价值，快速上线获取用户反馈。

### 3.2 MVP 功能范围

#### 3.2.1 必须包含的功能（MVP Core）

1. **八字输入表单**
   - 基础字段：性别、出生年份、四柱干支、起运年龄、第一步大运
   - 自动计算大运方向
   - 基础验证

2. **Prompt 生成（简化版）**
   - 单一 Prompt 类型（default）
   - 生成系统提示 + 用户提示
   - 一键复制功能

3. **文件上传**
   - 拖拽上传 JSON 文件
   - 基础数据验证
   - 支持 V1 格式（最简格式）

4. **K 线图展示**
   - 基础 K 线图（100 年）
   - 点击查看流年详批
   - 基础缩放功能

5. **分析结果展示**
   - 6 个维度评分展示
   - 基础统计分析

#### 3.2.2 MVP 不包含的功能（后续迭代）

- ❌ 多版本数据格式兼容（V2/V3/V4）
- ❌ 多维度 K 线图
- ❌ 历史记录功能
- ❌ 数据导出功能
- ❌ 使用日志埋点
- ❌ 版本更新公告
- ❌ 复杂的交互功能（全屏、高级筛选等）

### 3.3 MVP 技术栈（最小化）

**前端**
- React + TypeScript（核心框架）
- Vite（构建工具）
- Tailwind CSS（样式）
- Recharts（图表）

**后端**
- ❌ 无需后端（MVP 阶段）

**部署**
- GitHub Pages（静态托管）

### 3.4 MVP 开发时间估算

- **Week 1**：项目搭建 + 八字输入表单 + Prompt 生成
- **Week 2**：文件上传 + 数据解析 + K 线图基础实现
- **Week 3**：分析结果展示 + 基础交互 + 测试优化
- **Week 4**：UI 优化 + 文档 + 部署上线

**总计**：4 周（1 人）

### 3.5 MVP 到完整版本的迭代路径

**V1.0（MVP）**
- ✅ 基础功能上线
- ✅ 获取用户反馈

**V1.1（数据兼容）**
- ✅ 支持 V2/V3 格式
- ✅ 优化数据转换逻辑

**V1.2（用户体验）**
- ✅ 历史记录功能
- ✅ 数据导出功能
- ✅ 使用帮助文档

**V2.0（功能增强）**
- ✅ 多维度 K 线图
- ✅ 版本更新公告
- ✅ 使用日志埋点

**V2.1+（持续优化）**
- 🔄 性能优化
- 🔄 新功能迭代
- 🔄 用户反馈响应

---

## 四、技术栈深度解析

### 4.1 前端核心框架

#### 4.1.1 React 19 + TypeScript

**技术选型理由**
- **React 19**：最新稳定版本，支持自动批处理优化
- **TypeScript**：类型安全，提升代码可维护性

**核心应用**

**1. 组件化架构**
```typescript
// 15+ 个功能组件，职责清晰
src/components/
├── BaziForm.tsx              // 八字输入表单
├── EnhancedKLineChart.tsx    // 增强型 K 线图（核心组件，970+ 行）
├── MultiDimensionKLineChart.tsx // 多维度 K 线图
├── FileUpload.tsx            // 文件上传（支持拖拽）
├── PromptDisplay.tsx         // Prompt 展示与复制
├── AnalysisResult.tsx        // 分析结果展示
├── StatisticsPanel.tsx       // 统计分析面板
└── ...
```

**2. Hooks 状态管理**
```typescript
// App.tsx - 主应用状态管理
const [result, setResult] = useState<LifeDestinyResult | null>(null);
const [userName, setUserName] = useState<string>('');
const [showPrompt, setShowPrompt] = useState(false);
const toast = useToast(); // 自定义 Hook

// 使用 useMemo 优化计算结果
const resultOverview = useMemo(() => {
  if (!result || !result.chartData || result.chartData.length === 0) return null;
  const scores = result.chartData.map(d => d.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  // ... 复杂计算逻辑
  return { avgScore, maxYear, minYear, summaryText };
}, [result]);
```

**3. 自定义 Hooks 封装**
```typescript
// src/hooks/useToast.ts - Toast 通知系统
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const showToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    return id;
  }, []);
  
  // 提供 success/error/warning/info 方法
  return { toasts, success, error, warning, info, removeToast };
};
```

**技术亮点**
- ✅ **函数式组件 + Hooks**：100% 函数式组件，无 Class 组件
- ✅ **性能优化**：使用 `useMemo`、`useCallback` 优化计算和渲染
- ✅ **类型安全**：完整的 TypeScript 类型定义，编译时错误检查
- ✅ **代码复用**：自定义 Hooks 封装通用逻辑

#### 4.1.2 TypeScript 严格模式

**配置**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // 启用所有严格检查
    "noUnusedLocals": true,            // 未使用的局部变量报错
    "noUnusedParameters": true,        // 未使用的参数报错
    "noFallthroughCasesInSwitch": true, // switch 语句必须有 break
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
  }
}
```

**类型定义体系**
```typescript
// src/types.ts - 统一的类型定义中心

// 枚举类型
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export type PromptType = 'default' | 'detailed' | 'detailed_v2' | 'detailed_v3' | 'detailed_v4' | 'custom';

// 核心接口
export interface BaziInput {
  name?: string;
  gender: Gender;
  birthYear: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  startAge: string;
  firstDaYun: string;
  promptType?: PromptType;
  customPrompt?: string;
}

// 多版本数据格式兼容
export interface LifeDestinyResult {
  chartData: KLinePoint[];
  analysis: AnalysisData;
  v2Data?: LifeDestinyResultV2;  // V2 格式扩展
  v3Extras?: {                    // V3 格式扩展
    summaryOverview?: any;
    futureFocus?: any;
  };
  v4Extras?: LifeDestinyResultV4; // V4 格式扩展
  userName?: string;
}
```

### 4.2 UI 与样式系统

#### 4.2.1 Tailwind CSS

**技术选型理由**
- **开发效率**：原子化 CSS，快速构建 UI
- **一致性**：统一的间距、颜色系统
- **响应式**：内置响应式设计工具
- **体积优化**：按需生成，生产环境体积小

**核心应用**

**1. 响应式设计**
```typescript
// 移动端和桌面端自适应
<div className="flex flex-col md:flex-row md:items-center gap-3">
  <h3 className="text-lg md:text-xl font-bold">标题</h3>
  <button className="hidden md:inline-flex">桌面端按钮</button>
</div>
```

**2. 自定义动画**
```javascript
// tailwind.config.js
theme: {
  extend: {
    animation: {
      'slide-in-right': 'slideInRight 0.3s ease-out',
      'fade-in': 'fadeIn 0.3s ease-in',
    },
    keyframes: {
      slideInRight: {
        '0%': { transform: 'translateX(100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
    },
  },
}
```

### 4.3 数据可视化

#### 4.3.1 Recharts

**技术选型理由**
- **React 原生**：专为 React 设计，组件化
- **功能丰富**：支持多种图表类型
- **可定制性强**：支持自定义组件和样式
- **TypeScript 支持**：完整的类型定义

**核心应用**

**1. K 线图实现**
```typescript
// EnhancedKLineChart.tsx - 自定义 K 线形状组件
const CandleShape = (props: any) => {
  const { x, y, width, height, payload, yAxis } = props;
  const { open, close, high, low } = payload;
  const isUp = close >= open;
  
  // 计算实体和影线的位置
  const bodyTop = Math.min(openY, closeY);
  const bodyBottom = Math.max(openY, closeY);
  const bodyHeight = Math.max(3, bodyBottom - bodyTop);
  
  return (
    <g>
      {/* 上影线 */}
      {hasUpperShadow && (
        <line x1={centerX} y1={highY} x2={centerX} y2={bodyTop} />
      )}
      {/* 实体 */}
      <rect x={bodyX} y={bodyTop} width={bodyWidth} height={bodyHeight} />
      {/* 下影线 */}
      {hasLowerShadow && (
        <line x1={centerX} y1={bodyBottom} x2={centerX} y2={lowY} />
      )}
    </g>
  );
};

// 使用自定义形状
<Bar dataKey="bodyRange" shape={<CandleShape />} />
```

**2. 交互功能实现**
```typescript
// 缩放功能
const [ageRange, setAgeRange] = useState<[number, number]>([1, 100]);

// 鼠标滚轮缩放
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const mouseX = e.clientX - svgRect.left;
    const ageAtMouse = ageRange[0] + (mouseX / svgWidth) * (ageRange[1] - ageRange[0]);
    // 以鼠标位置为中心缩放
    const newRange = range + delta;
    // ... 计算新的范围
  };
}, [ageRange]);

// 触摸缩放（移动端）
useEffect(() => {
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const scale = initialDistance / currentDistance;
      const newRange = initialRange * scale;
      // ... 更新范围
    }
  };
}, []);
```

**3. 多维度 K 线图**
```typescript
// MultiDimensionKLineChart.tsx - 各维度趋势曲线
const chartData = useMemo(() => {
  return data.map((point) => {
    const overallYearScore = point.score ?? avgScore;
    const result: any = { age: point.age, year: point.year };

    dimensions.forEach((dim) => {
      const dimTarget = dim.overallScore || 50;
      
      // 混合算法：70% 整体走势 + 30% 维度目标分
      const alpha = 0.7;
      const blended = overallYearScore * alpha + dimTarget * (1 - alpha);
      
      // 稳定的轻微扰动（保证不同维度线条不完全重合）
      const seed = (point.year * 13 + dim.key.length * 17) % 11;
      const variation = (seed - 5) * 0.8; // -4 ~ +4 分的小波动
      
      const raw = blended + variation;
      const clamped = Math.max(0, Math.min(100, raw));
      result[dim.key] = Number(clamped.toFixed(1));
    });

    return result;
  });
}, [data, dimensions]);

// 绘制各维度曲线
{dimensions.map(dim => (
  <Line
    key={dim.key}
    type="monotone"
    dataKey={dim.key}
    stroke={dim.color}
    strokeWidth={2.5}
    dot={false}
    activeDot={{ r: 4 }}
    name={dim.name}
  />
))}
```

### 4.4 表单处理与数据验证

#### 4.4.1 React Hook Form + Zod

**技术选型理由**
- **React Hook Form**：非受控组件，性能优秀
- **Zod**：TypeScript 原生，类型推导，运行时验证

**核心应用**

**1. 表单处理**
```typescript
// BaziForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { baziInputSchema } from '../utils/validation';

const { register, handleSubmit, formState: { errors } } = useForm<BaziInputFormData>({
  resolver: zodResolver(baziInputSchema),
});

// 表单字段
<input
  {...register('birthYear')}
  className={errors.birthYear ? 'border-red-500' : ''}
/>
{errors.birthYear && <span>{errors.birthYear.message}</span>}
```

**2. 数据验证 Schema**
```typescript
// src/utils/validation.ts

// 干支验证（自定义验证规则）
const ganZhiSchema = z.string().refine(
  (val) => {
    if (!val || val.length !== 2) return false;
    const [gan, zhi] = val.split('');
    return TIAN_GAN.includes(gan) && DI_ZHI.includes(zhi);
  },
  { message: '请输入正确的干支格式（如：甲子）' }
);

// 完整的输入验证 Schema
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
    .refine((val) => {
      const age = parseInt(val);
      return !isNaN(age) && age >= 1 && age <= 100;
    }, { message: '起运年龄应在 1-100 之间' }),
  firstDaYun: ganZhiSchema,
  promptType: z.enum(['default', 'detailed', 'detailed_v2', 'detailed_v3', 'detailed_v4', 'custom']).optional(),
});

// 类型推导
export type BaziInputFormData = z.infer<typeof baziInputSchema>;
```

**3. 运行时数据验证**
```typescript
// FileUpload.tsx - 验证上传的 JSON 数据
export const validateLifeDestinyResult = (data: unknown) => {
  return lifeDestinyResultSchema.safeParse(data);
};

// 使用
const result = validateLifeDestinyResult(rawData);
if (!result.success) {
  const errors = getValidationErrors(result.error);
  setError(`数据验证失败：${Object.values(errors).join(', ')}`);
  return;
}
```

### 4.5 构建工具与工程化

#### 4.5.1 Vite

**技术选型理由**
- **极速开发**：基于 ESM 的 HMR，毫秒级热更新
- **构建快速**：使用 Rollup 打包，构建速度快
- **开箱即用**：零配置，支持 TypeScript、CSS 预处理器等

**核心配置**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: false, // 端口被占用时自动尝试下一个
    open: true, // 自动打开浏览器
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  // 环境变量处理
  define: {
    'process.env.API_KEY': JSON.stringify(apiKey || ''),
  },
});
```

### 4.6 后端与基础设施

#### 4.6.1 Vercel Serverless Functions

**技术选型理由**
- **零配置部署**：与 GitHub 集成，自动部署
- **按需计费**：Serverless 架构，按使用量计费
- **全球 CDN**：自动 CDN 加速

**核心实现**
```typescript
// api/log.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 手动解析请求体（兼容不同环境）
  const body = await parseBody(req);
  const { userId, account, operation, pageData, timestamp } = body || {};

  try {
    const { error } = await supabase.from('usage_logs').insert({
      user_id: userId || null,
      account: account || null,
      operation,
      page_data: pageData ?? null,
      created_at: new Date(toSeconds(timestamp) * 1000).toISOString(),
    });
    
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'insert failed', detail: error?.message });
  }
}
```

#### 4.6.2 Supabase

**技术选型理由**
- **PostgreSQL**：强大的关系型数据库
- **RESTful API**：自动生成 REST API
- **Row Level Security**：行级安全策略

**数据库设计**
```sql
-- usage_logs 表
CREATE TABLE usage_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  account TEXT,
  operation TEXT NOT NULL,
  page_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引优化
CREATE INDEX idx_operation ON usage_logs(operation);
CREATE INDEX idx_created_at ON usage_logs(created_at);
```

---

## 五、核心功能实现细节

### 5.1 多版本数据格式兼容

#### 5.1.1 问题背景

不同 AI 模型返回的 JSON 格式不一致：
- **V1 格式**：基础格式，包含 chartPoints 和 analysis
- **V2 格式**：包含 timeline、baseChart、globalDimensions
- **V3 格式**：包含 profile、summary.dimensions
- **V4 格式**：包含 bazi_logic、history_checkpoints、chartPoints（k_line 字段）

#### 5.1.2 解决方案

**1. 统一数据接口设计**
```typescript
// src/types.ts
export interface LifeDestinyResult {
  chartData: KLinePoint[]; // 统一转换为 KLinePoint 格式
  analysis: AnalysisData;  // 兼容旧格式
  v2Data?: LifeDestinyResultV2;  // V2 格式扩展
  v3Extras?: {                    // V3 格式扩展
    summaryOverview?: any;
    futureFocus?: any;
  };
  v4Extras?: LifeDestinyResultV4; // V4 格式扩展
  userName?: string;
}
```

**2. 数据转换层**
```typescript
// src/components/FileUpload.tsx
const convertGeminiResult = (raw: any): LifeDestinyResult => {
  // 检查是否是 V4 格式
  if (raw.bazi_logic && Array.isArray(raw.chartPoints) && raw.chartPoints.length > 0) {
    const firstPoint = raw.chartPoints[0];
    if (firstPoint.k_line || (firstPoint.open === undefined && firstPoint.k_line)) {
      // V4 格式转换
      const chartData = convertV4ChartPointsToKLinePoints(raw.chartPoints);
      const analysis = convertV4ScoresToAnalysis(raw.scores, raw.bazi_logic);
      return {
        chartData,
        analysis,
        v4Extras: {
          bazi_logic: raw.bazi_logic,
          history_checkpoints: Array.isArray(raw.history_checkpoints) ? raw.history_checkpoints : [],
          scores: raw.scores || {},
          chartPoints: raw.chartPoints,
        },
      };
    }
  }

  // 检查是否是 V2 格式
  if (raw.timeline && Array.isArray(raw.timeline)) {
    // V2 格式转换
    const chartData = convertTimelineToKLinePoints(raw.timeline);
    const analysis = convertGlobalDimensionsToAnalysis(raw.globalDimensions, raw.baseChart);
    return {
      chartData,
      analysis,
      v2Data: {
        meta: raw.meta,
        baseChart: raw.baseChart,
        globalDimensions: raw.globalDimensions,
        timeline: raw.timeline,
      },
    };
  }

  // 检查是否是 V3 格式
  if (raw.profile && raw.summary && raw.summary.dimensions) {
    // V3 格式转换
    // ... 转换逻辑
  }

  // V1 格式（旧格式，向后兼容）
  // ... 转换逻辑
};
```

**3. 数据验证**
```typescript
// 使用 Zod 进行运行时验证
const validationResult = validateLifeDestinyResult(convertedData);

if (!validationResult.success) {
  const errors = getValidationErrors(validationResult.error);
  setError(`数据验证失败：${Object.values(errors).join(', ')}`);
  return;
}
```

**技术亮点**
- ✅ **向后兼容**：支持 4 种数据格式版本
- ✅ **类型安全**：TypeScript 类型定义保证数据一致性
- ✅ **运行时验证**：Zod 确保数据质量
- ✅ **友好错误提示**：详细的验证错误信息

### 5.2 Prompt 生成系统

#### 5.2.1 核心逻辑

**1. Prompt 模板管理**
```typescript
// src/services/promptGenerator.ts

// Prompt 缓存
const promptCache: Record<string, string> = {};

// 从文件加载 Prompt
const loadPromptFromFile = async (filename: string): Promise<string> => {
  if (promptCache[filename]) {
    return promptCache[filename];
  }

  try {
    const response = await fetch(`/prompts/${filename}`);
    const text = await response.text();
    promptCache[filename] = text.trim();
    return promptCache[filename];
  } catch (error) {
    console.error(`Error loading prompt ${filename}:`, error);
    return getDefaultFallbackPrompt();
  }
};
```

**2. 大运方向计算**
```typescript
// 根据年柱天干和性别计算大运方向
const getStemPolarity = (pillar: string): 'YANG' | 'YIN' => {
  const firstChar = pillar.trim().charAt(0);
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  const yinStems = ['乙', '丁', '己', '辛', '癸'];
  
  if (yangStems.includes(firstChar)) return 'YANG';
  if (yinStems.includes(firstChar)) return 'YIN';
  return 'YANG';
};

// 计算大运方向
const yearStemPolarity = getStemPolarity(input.yearPillar);
let isForward = false;

if (input.gender === Gender.MALE) {
  isForward = yearStemPolarity === 'YANG';
} else {
  isForward = yearStemPolarity === 'YIN';
}

const daYunDirectionStr = isForward ? '顺行 (Forward)' : '逆行 (Backward)';
```

**3. 双段式 Prompt 生成**
```typescript
export const generateGeminiPrompt = async (input: BaziInput): Promise<{
  systemPrompt: string;
  userPrompt: string;
  fullPrompt: string;
}> => {
  // 获取系统 Prompt（异步加载）
  const systemPrompt = await getSystemPromptByType(promptType, input.customPrompt);

  // 生成用户 Prompt
  const userPrompt = `请根据以下**已经排好的**八字四柱和**指定的大运信息**进行分析。

【基本信息】
性别：${genderStr}
出生年份：${input.birthYear}年 (阳历)

【八字四柱】
年柱：${input.yearPillar}
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
3. **填充 JSON**：
   - Age 1 到 ${startAgeInt - 1}: daYun = "童限"
   - Age ${startAgeInt} 到 ${startAgeInt + 9}: daYun = [第1步大运: ${input.firstDaYun}]
   - ...以此类推直到 100 岁。

任务：
1. 确认格局与喜忌。
2. 生成 **1-100 岁 (虚岁)** 的人生流年K线数据。
3. 在 \`reason\` 字段中提供流年详批。
4. 生成带评分的命理分析报告。`;

  return { systemPrompt, userPrompt, fullPrompt };
};
```

**技术亮点**
- ✅ **模板化设计**：支持多种 Prompt 类型，易于扩展
- ✅ **缓存机制**：内存缓存，提升加载速度
- ✅ **自动计算**：自动计算大运方向，减少用户输入
- ✅ **错误处理**：文件加载失败时使用默认 Prompt

### 5.3 多维度 K 线图打分逻辑

#### 5.3.1 优化后的算法

**核心思路**：基于整体 K 线年度分数 + 各维度总评，通过混合算法生成各维度年度曲线。

```typescript
// MultiDimensionKLineChart.tsx
const chartData = useMemo(() => {
  if (!data.length) return [];

  const avgScore =
    data.reduce((sum, p) => sum + (p.score ?? 0), 0) / Math.max(data.length, 1) || 50;

  return data.map((point) => {
    const overallYearScore = point.score ?? avgScore; // 当前年份整体分
    const result: any = {
      age: point.age,
      year: point.year,
    };

    dimensions.forEach((dim) => {
      const dimTarget = dim.overallScore || 50; // 该维度的长期目标分（0-100）

      // 1）混合算法：70% 整体走势 + 30% 维度目标分
      //   - alpha = 0.7：更贴近整体 K 线走势，保证趋势一致性
      //   - (1 - alpha) = 0.3：向维度目标分拉近，体现维度特性
      const alpha = 0.7;
      const blended = overallYearScore * alpha + dimTarget * (1 - alpha);

      // 2）根据年份和维度 key 生成一个稳定的轻微扰动
      //   - 使用年份和 key 长度作为种子，保证相同输入产生相同输出
      //   - variation 范围：-4 ~ +4 分，保证不同维度线条不完全重合
      const seed = (point.year * 13 + dim.key.length * 17) % 11; // 0-10
      const variation = (seed - 5) * 0.8; // -4 ~ +4 分的小波动

      const raw = blended + variation;
      const clamped = Math.max(0, Math.min(100, raw));
      result[dim.key] = Number(clamped.toFixed(1));
    });

    return result;
  });
}, [data, dimensions]);
```

**算法优势**
- ✅ **趋势一致性**：70% 权重保证各维度曲线与整体 K 线趋势一致
- ✅ **维度差异化**：30% 权重体现各维度的长期特性
- ✅ **稳定性**：使用确定性算法，相同输入产生相同输出
- ✅ **平滑性**：扰动范围小（±4 分），曲线平滑自然

---

## 六、架构设计

### 6.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                     前端应用层                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  App.tsx │  │ Components│  │  Hooks   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     服务层                               │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │promptGenerator│  │ usageLogger  │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     工具层                               │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  validation  │  │   storage     │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   后端服务（可选）                        │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │Vercel Function│  │   Supabase   │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### 6.2 组件层次结构

```
App.tsx (主应用)
├── Header (导航栏)
├── Multi-step Guide (步骤指示器)
├── BaziForm (八字输入表单)
├── FileUpload (文件上传)
├── PromptDisplay (Prompt 展示)
├── Results View (结果展示)
│   ├── Result Overview (整体概览)
│   ├── Key Years Summary (关键 5 年)
│   ├── Future Focus (未来 3 年)
│   ├── EnhancedKLineChart (总体 K 线图)
│   ├── MultiDimensionKLineChart (多维度 K 线图)
│   ├── StatisticsPanel (统计分析)
│   ├── DimensionComparisonChart (维度对比)
│   └── AnalysisResult (文本报告)
├── HistoryPanel (历史记录)
├── HelpPage (帮助页面)
├── ToastContainer (通知容器)
└── AnnouncementModal (更新公告)
```

### 6.3 数据流

```
用户输入 (BaziInput)
    │
    ▼
生成 Prompt (promptGenerator)
    │
    ▼
用户与 AI 对话 (外部)
    │
    ▼
上传 JSON (FileUpload)
    │
    ▼
数据转换 (convertGeminiResult)
    │
    ▼
数据验证 (Zod validation)
    │
    ▼
状态更新 (setResult)
    │
    ▼
UI 渲染 (Components)
```

---

## 七、数据流与状态管理

### 7.1 状态管理策略

**采用 React Hooks 进行状态管理，无全局状态管理库（Redux/Zustand）**

**原因**：
- 应用规模适中，组件层级不深
- 状态共享需求有限，主要通过 Props 传递
- 减少依赖，降低复杂度

**状态分布**：
```typescript
// App.tsx - 全局状态
const [result, setResult] = useState<LifeDestinyResult | null>(null);
const [userName, setUserName] = useState<string>('');
const [showPrompt, setShowPrompt] = useState(false);
const [promptData, setPromptData] = useState<...>(null);

// 组件内部状态
// EnhancedKLineChart.tsx
const [ageRange, setAgeRange] = useState<[number, number]>([1, 100]);
const [showKeyYears, setShowKeyYears] = useState(true);
const [zoomLevel, setZoomLevel] = useState(1);

// MultiDimensionKLineChart.tsx
const [activeDimensions, setActiveDimensions] = useState<string[]>(['summary', 'wealth', 'marriage']);
```

### 7.2 数据持久化

**1. 本地存储（localStorage）**
```typescript
// src/utils/storage.ts
export const saveToHistory = (result: LifeDestinyResult, input: BaziInput) => {
  try {
    const history = getHistory();
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userName: result.userName || input.name || '未命名',
      input,
      result: {
        chartData: result.chartData.slice(0, 10), // 只保存前 10 个数据点
        analysis: result.analysis,
      },
    };
    
    const updated = [newEntry, ...history.slice(0, 49)]; // 最多保存 50 条
    localStorage.setItem('lifekline_history', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};
```

**2. 版本记忆（localStorage）**
```typescript
// App.tsx - 公告版本记忆
const ANNOUNCEMENT_VERSION = 'multi-dimension-kline-v1';

useEffect(() => {
  try {
    if (typeof window === 'undefined') return;
    const seenVersion = window.localStorage.getItem('announcement_version');
    if (seenVersion !== ANNOUNCEMENT_VERSION) {
      setShowAnnouncement(true);
    }
  } catch {
    // 忽略 localStorage 异常
  }
}, []);
```

---

## 八、性能优化实践

### 8.1 React 性能优化

**1. useMemo 优化计算**
```typescript
// 避免重复计算
const resultOverview = useMemo(() => {
  if (!result || !result.chartData || result.chartData.length === 0) return null;
  const scores = result.chartData.map(d => d.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  // ... 复杂计算
  return { avgScore, maxYear, minYear, summaryText };
}, [result]); // 只有 result 变化时才重新计算
```

**2. useCallback 优化函数**
```typescript
// 避免子组件不必要的重渲染
const handleGeneratePrompt = useCallback(async (data: BaziInput) => {
  // ... 处理逻辑
}, []); // 依赖项为空，函数引用稳定
```

**3. 数据过滤优化**
```typescript
// 图表数据过滤
const filteredData = useMemo(() => {
  return data.filter(d => d.age >= ageRange[0] && d.age <= ageRange[1]);
}, [data, ageRange]);
```

### 8.2 图表性能优化

**1. 数据采样（可选）**
```typescript
// 根据缩放级别采样数据
const getSampledData = (data: KLinePoint[], zoomLevel: number) => {
  if (zoomLevel > 0.5) return data; // 高缩放显示全部
  const step = Math.ceil(1 / zoomLevel);
  return data.filter((_, index) => index % step === 0);
};
```

**2. 虚拟滚动（未来优化）**
```typescript
// 可以使用 react-window 实现虚拟滚动
import { FixedSizeList } from 'react-window';
```

### 8.3 构建优化

**1. 代码分割（建议）**
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'chart-vendor': ['recharts'],
        'form-vendor': ['react-hook-form', 'zod'],
      },
    },
  },
}
```

---

## 九、面试回答要点

### 9.1 项目介绍（2-3分钟）

> "这是一个将传统八字命理学与现代可视化技术相结合的前端项目。核心思路是让用户通过 3 步简单操作，就能获得 100 年人生运势的 K 线图可视化。
>
> **项目背景**：传统命理工具存在输入繁琐、结果抽象、难以保存的痛点。我通过简化流程、可视化展示、多维度分析解决了这些问题。
>
> **技术亮点**：
> 1. **多版本数据兼容**：设计了统一的数据转换层，支持 V1/V2/V3/V4 四种 JSON 格式，通过 TypeScript + Zod 保证类型安全和数据质量
> 2. **增强型 K 线图组件**：使用 Recharts 自定义 K 线形状，实现了缩放、筛选、关键年份标注、全屏等丰富的交互功能，支持桌面端和移动端
> 3. **多维度 K 线图**：基于整体 K 线和各维度评分，通过混合算法（70% 整体走势 + 30% 维度特性）生成各维度趋势曲线
> 4. **数据闭环机制**：前端统一埋点 + Vercel Serverless + Supabase 存储，通过数据分析和用户反馈持续优化产品
>
> **个人贡献**：从 0 到 1 主导项目，包括需求分析、技术架构设计、前后端开发。通过数据驱动的方式，将 AI 输出格式稳定率从 ~60% 提升到 ~95%。"

### 9.2 技术难点（1-2分钟）

> "最大的技术难点是处理不同 AI 模型返回的 JSON 格式不一致问题。
>
> **问题**：不同版本的 Prompt 模板导致 AI 返回的数据结构不同，V1/V2/V3/V4 格式差异很大。
>
> **解决方案**：
> 1. **统一数据接口设计**：定义了 `LifeDestinyResult` 接口，包含基础字段和可选的扩展字段（v2Data、v3Extras、v4Extras）
> 2. **数据转换层**：实现了 `convertGeminiResult` 函数，自动识别格式版本并转换
> 3. **类型安全**：使用 TypeScript 定义完整类型，Zod 进行运行时验证
> 4. **迭代优化**：通过埋点数据分析，持续优化 Prompt 模板，提升格式稳定率
>
> **收获**：学会了如何设计可扩展的数据架构，以及如何通过数据驱动的方式优化系统。"

### 9.3 技术选型（1分钟）

> "我选择这些技术栈主要基于以下几个考虑：
>
> **1. 开发效率**：Vite + React + TypeScript 提供了极速的开发体验和类型安全，Tailwind CSS 让 UI 开发更高效。
>
> **2. 性能要求**：Recharts 专为 React 设计，性能优秀；React Hook Form 使用非受控组件，减少不必要的重渲染。
>
> **3. 类型安全**：TypeScript + Zod 提供了编译时和运行时的双重类型保障，确保数据质量。
>
> **4. 全栈能力**：Vercel Serverless + Supabase 让我能够快速搭建后端服务，无需管理服务器。
>
> **5. 可维护性**：完整的类型定义、组件化架构、错误处理机制，让代码易于维护和扩展。"

### 9.4 产品思维（1分钟）

> "这个项目让我深入实践了产品思维：
>
> **1. 用户研究**：通过观察传统工具的痛点，识别出输入繁琐、结果抽象、难以保存三大问题
>
> **2. 解决方案设计**：将复杂的排盘流程简化为 3 步，用 K 线图可视化趋势，设计多维度分析体系
>
> **3. 数据驱动迭代**：
> - 通过埋点记录用户行为（生成 Prompt、上传结果、查看历史等）
> - 结合用户反馈，迭代优化 Prompt 结构和交互流程
> - 格式稳定率从 ~60% 提升到 ~95%
>
> **4. MVP 思维**：先实现核心功能（八字输入、Prompt 生成、K 线图展示），再逐步添加多维度分析、历史记录、数据导出等功能"

### 9.5 项目亮点总结

**技术亮点**
1. ✅ **多版本数据兼容**：统一的数据转换层，支持 4 种格式版本
2. ✅ **增强型图表组件**：自定义 K 线形状，丰富的交互功能
3. ✅ **多维度可视化**：混合算法生成各维度趋势曲线
4. ✅ **数据闭环机制**：埋点 + 反馈 + 迭代优化

**产品亮点**
1. ✅ **降低使用门槛**：3 步主流程，降低学习成本
2. ✅ **可视化趋势**：K 线图直观展示人生运势
3. ✅ **多维度分析**：6 大维度全面分析
4. ✅ **数据驱动**：通过数据分析持续优化产品

**个人贡献**
1. ✅ **从 0 到 1**：主导需求分析、技术架构、前后端开发
2. ✅ **技术深度**：深入实践 React、TypeScript、数据可视化
3. ✅ **产品思维**：用户研究、数据驱动、迭代优化
4. ✅ **全栈能力**：前端 + Serverless + 数据库设计

---

## 十、项目数据与成果

### 10.1 技术指标

- **代码量**：~15,000 行 TypeScript/TSX
- **组件数**：15+ 个功能组件
- **类型定义**：完整的 TypeScript 类型体系
- **数据格式兼容**：支持 4 种 JSON 格式版本
- **格式稳定率**：从 ~60% 提升到 ~95%

### 10.2 功能指标

- **核心功能**：8 个主要功能模块
- **交互功能**：缩放、筛选、全屏、触摸支持等
- **数据导出**：支持 JSON/PNG/PDF 三种格式
- **响应式设计**：支持桌面端和移动端

### 10.3 用户体验指标

- **操作步骤**：3 步主流程（填八字 → 生成 Prompt → 上传 JSON）
- **学习成本**：提供详细的使用帮助文档
- **错误处理**：友好的错误提示和验证信息
- **性能体验**：流畅的图表交互，支持大数据量渲染

---

## 十一、后续优化方向

### 11.1 技术优化

- **代码分割**：实现懒加载，减少初始包体积
- **图表虚拟化**：使用虚拟滚动优化大数据量渲染
- **Service Worker**：添加离线支持
- **构建优化**：优化打包配置，减少构建产物大小

### 11.2 功能扩展

- **更多 AI 平台**：支持更多 AI 模型
- **数据对比**：支持多个命盘对比
- **分享功能**：生成分享链接，方便传播
- **数据分析**：基于历史数据提供更深入的分析

### 11.3 产品优化

- **用户反馈**：建立更完善的反馈机制
- **使用教程**：添加视频教程和示例
- **社区功能**：建立用户社区，分享命理心得
- **商业化探索**：探索合理的商业模式

---

**总结**：这个项目展示了从前端到后端、从开发到部署的完整技术栈应用，体现了对现代前端开发最佳实践的深入理解和实践能力，同时也展现了产品思维和数据驱动的迭代方式。

