# 人生 K 线 | Life Destiny K-Line

**结合传统八字命理与金融可视化技术，将人生运势绘制成 K 线图**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [使用指南](#-使用指南) • [项目结构
](#-项目结构)

---

## 📖 项目简介

人生 K 线是一个创新的命理可视化工具，将传统八字命理学与现代金融 K 线图技术相结合。通过 AI 大模型（Gemini）分析用户的生辰八字，生成 100 年的人生运势 K 线图，帮助用户以直观的方式了解人生起伏、把握关键转折点。

### 核心特点

- 🎯 **无需 API 调用**：用户手动与 Gemini 对话，避免 API 调用失败
- 📊 **可视化展示**：100 年运势以 K 线图形式呈现，直观易懂
- 🔍 **详细分析**：包含总评、事业、财富、婚姻、健康、六亲等 6 个维度
- 🎨 **现代 UI**：采用 Tailwind CSS，界面简洁美观
- 📱 **响应式设计**：支持桌面和移动端访问

---

## ✨ 功能特性

### 1. 八字排盘

- 输入四柱干支（年、月、日、时）
- 自动计算大运排序方向（顺行/逆行）
- 支持自定义起运年龄和第一步大运

### 2. Prompt 生成

- 自动生成完整的 Gemini 对话 Prompt
- 包含系统角色设定和用户提示词
- 一键复制，方便与 Gemini 对话

### 3. 结果可视化

- **K 线图**：100 年运势走势，绿色代表吉运，红色代表凶运
- **详细批断**：点击 K 线查看每年的流年详批
- **多维度分析**：6 个维度评分（0-10 分）和详细分析

### 4. 文件上传

- 支持上传 Gemini 返回的 JSON 结果文件
- 自动数据格式转换和验证
- 拖拽上传，操作便捷

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装步骤

1. **克隆项目**

   ```bash
   git clone <repository-url>
   cd lifekline
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

4. **访问应用**

   - 打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

---

## 📖 使用指南

### 完整流程

#### 第一步：输入八字信息

1. 填写基本信息：

   - 姓名（可选）
   - 性别（乾造/坤造）
   - 出生年份（阳历）

2. 输入四柱干支：

   - 年柱（如：甲申）
   - 月柱（如：甲戌）
   - 日柱（如：戊辰）
   - 时柱（如：丁巳）

3. 输入大运信息：

   - 起运年龄（虚岁）
   - 第一步大运干支

#### 第二步：生成 Prompt

1. 点击"生成 Gemini Prompt"按钮
2. 弹出窗口显示完整的 Prompt 内容
3. 复制"系统角色设定"并发送给 Gemini
4. 等待 Gemini 确认后，复制"用户提示词"并发送
5. Gemini 会返回 JSON 格式的分析结果

#### 第三步：上传结果

1. 将 Gemini 返回的 JSON 保存为文件（如：result.json）
2. 关闭 Prompt 窗口
3. 在文件上传区域拖拽或选择 JSON 文件
4. 系统自动解析并显示 K 线图和分析报告

### 查看结果

- **K 线图**：查看 100 年运势走势
- **点击 K 线**：查看每年的详细流年批断
- **分析报告**：查看各维度的评分和分析

---

## 📁 项目结构

```
lifekline/
├── src/                     # 源代码目录
│   ├── components/          # React 组件
│   │   ├── AnalysisResult.tsx   # 分析结果展示组件
│   │   ├── BaziForm.tsx        # 八字输入表单
│   │   ├── FileUpload.tsx      # 文件上传组件
│   │   ├── LifeKLineChart.tsx  # K线图组件
│   │   └── PromptDisplay.tsx   # Prompt显示组件
│   ├── services/            # 服务层
│   │   ├── geminiService.ts    # Gemini API服务（保留用于向后兼容）
│   │   └── promptGenerator.ts  # Prompt生成服务
│   ├── App.tsx             # 主应用组件
│   ├── index.tsx           # 入口文件
│   ├── types.ts            # TypeScript类型定义
│   └── constants.ts         # 常量配置
├── public/                  # 静态资源目录
│   ├── metadata.json       # 元数据
│   └── web.config          # Web服务器配置
├── docs/                    # 文档目录
│   └── GEMINI_PROMPT_GUIDE.md  # Gemini Prompt使用指南
├── data/                    # 数据目录
│   ├── examples/           # 示例数据
│   │   ├── result.json         # 原始示例数据
│   │   └── result-converted.json # 转换后的示例数据
│   └── Users_data/         # 用户数据（可选）
├── index.html              # HTML模板（Vite入口）
├── vite.config.ts          # Vite配置
├── tsconfig.json           # TypeScript配置
├── package.json            # 项目配置
└── README.md               # 项目说明文档
```

---

## 🛠️ 技术栈

### 前端框架

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### UI 库

- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库
- **Recharts** - 图表库

### 核心功能

- **Prompt 生成** - 自动生成完整的 Gemini 对话 Prompt
- **数据转换** - 自动转换 Gemini 返回的 JSON 格式
- **文件上传** - 支持拖拽上传 JSON 文件

---

## 📝 数据格式

### 输入格式（BaziInput）

```typescript
{
  name?: string;           // 姓名（可选）
  gender: Gender;          // 性别（MALE/FEMALE）
  birthYear: string;       // 出生年份
  yearPillar: string;      // 年柱
  monthPillar: string;     // 月柱
  dayPillar: string;       // 日柱
  hourPillar: string;      // 时柱
  startAge: string;        // 起运年龄（虚岁）
  firstDaYun: string;      // 第一步大运
}
```

### 输出格式（LifeDestinyResult）

```typescript
{
  chartData: KLinePoint[];  // K线数据（100个数据点）
  analysis: AnalysisData;    // 分析报告
}
```

### K 线数据点格式

```typescript
{
  age: number;        // 年龄（1-100）
  year: number;       // 年份
  ganZhi: string;     // 流年干支
  daYun?: string;    // 大运干支
  open: number;       // 开盘价（0-100）
  close: number;      // 收盘价（0-100）
  high: number;       // 最高价（0-100）
  low: number;        // 最低价（0-100）
  score: number;      // 综合评分（0-100）
  reason: string;     // 流年详批（约100字）
}
```

---

## 🔧 开发指南

### 添加新功能

1. **新增组件**：在 `components/` 目录下创建新组件
2. **新增服务**：在 `services/` 目录下创建新服务
3. **类型定义**：在 `types.ts` 中添加类型定义

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 组件使用函数式组件
- 样式使用 Tailwind CSS

### 调试技巧

- 使用浏览器开发者工具查看网络请求
- 检查控制台日志了解数据流转
- 使用 React DevTools 调试组件状态

---

## 📚 相关文档

- [Gemini Prompt 完整指南](./docs/GEMINI_PROMPT_GUIDE.md) - 详细的 Prompt 使用说明

---

## ⚠️ 注意事项

1. **数据准确性**：本项目仅供娱乐与文化研究，请勿迷信
2. **数据隐私**：所有数据在本地处理，不会上传到服务器
3. **浏览器兼容**：建议使用现代浏览器（Chrome、Firefox、Edge 等）

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

本项目仅供学习和研究使用。

---

## 👤 作者

**推特@0xSakura666**

- 项目地址：[GitHub](https://github.com/your-username/lifekline)
- 问题反馈：[Issues](https://github.com/your-username/lifekline/issues)

---

## 🙏 致谢

- 感谢传统八字命理学的智慧
- 感谢 Gemini AI 的强大能力
- 感谢所有开源项目的支持

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star！**

</div>
