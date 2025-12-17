# 项目架构与命名规范（Architecture & Naming）

本项目已经有较完善的功能与文档，这里补充一份「整体架构 + 命名与文件管理规范」的说明，便于后续维护和协作。

---

## 一、整体架构概览

- **技术栈**
  - React + TypeScript + Vite
  - Tailwind CSS（UI 样式）
  - Recharts（图表）
  - Supabase（可选：埋点日志后端）

- **应用层级**
  - `src/index.tsx`：应用入口，挂载 `App`
  - `src/App.tsx`：页面布局和业务流核心（表单 → Prompt 生成 → JSON 上传 → 可视化）
  - `src/components/`：所有 UI 组件，按「功能 + 语义」命名
  - `src/services/`：与外部服务/AI/日志相关的纯函数与服务
  - `src/utils/`：通用工具（校验、本地存储等）
  - `src/types.ts`：统一的类型定义中心
  - `src/constants.ts`：跨模块复用的常量（如系统 Prompt 说明）

---

## 二、命名规范

### 2.1 项目与包名

- 仓库：`LeslieWylie/LeslieWylie.github.io`
- NPM 包名（本地使用）：`lifekline`
- 页面标题与品牌：
  - 中文：**人生 K 线**
  - 英文副标题：**Life Destiny K-Line**

### 2.2 目录与文件命名

- 统一使用 **小写 + 中划线 / 驼峰** 规则：
  - 目录：`src`, `components`, `services`, `utils`, `data`, `docs`
  - React 组件文件：`PascalCase`，如 `BaziForm.tsx`, `EnhancedKLineChart.tsx`
  - 工具/服务：`camelCase` 导出函数，如 `generateGeminiPrompt`, `logUsage`

- 特殊目录约定：
  - `data/examples/`：可提交到 Git，用于示例与调试
  - `data/Users_data/`：**用户私有数据目录**，在 `.gitignore` 中忽略
  - `public/prompts/`：Prompt 模板，文件名与 `PromptType` 一一对应：
    - `default.txt`
    - `detailed.txt`
    - `detailed_v2.txt`
    - `detailed_v3.txt`

### 2.3 类型与接口命名

- 所有 TypeScript 类型统一放在 `src/types.ts`，命名约定：
  - 枚举：`Gender`, `TrendType`
  - 接口：`BaziInput`, `LifeDestinyResult`, `KLinePoint`, `TimelinePoint`
  - V2/V3 扩展：在原有类型基础上增加清晰前缀，如：
    - `LifeDestinyResultV2`
    - `BaseChart`, `GlobalDimensions`, `MetaData`

---

## 三、文件管理规范

### 3.1 代码目录

- `src/components/`
  - 所有 UI 组件，建议按「页面区块」分组：
    - 表单与输入：`BaziForm`, `FileUpload`, `HelpPage`
    - 可视化：`EnhancedKLineChart`, `StatisticsPanel`, `DimensionComparisonChart`
    - 结果展示：`AnalysisResult`, `ExportButton`
    - 框架辅助：`ErrorBoundary`, `Toast`, `ToastContainer`, `LoadingSpinner`, `HistoryPanel`, `PromptDisplay`

- `src/services/`
  - `promptGenerator.ts`：Prompt 生成逻辑（当前推荐路径）
  - `usageLogger.ts`：埋点日志发送
  - `geminiService.ts`：**历史兼容**的直连模型服务（如无需求，可仅保留，不在 UI 中暴露）

- `src/utils/`
  - `validation.ts`：Zod 校验与验证工具
  - `storage.ts`：历史记录、本地存储相关工具

### 3.2 数据与隐私

- `data/examples/`
  - 存放公开示例 JSON，方便用户理解数据格式
  - 可以安全提交到仓库

- `data/Users_data/`
  - 存放用户真实 JSON 文件或分析结果备份
  - 已在 `.gitignore` 中忽略：`data/Users_data/*.json`
  - 如需保证目录存在，可使用 `.gitkeep`

### 3.3 配置与工具

- 代码质量与风格：
  - `.eslintrc.json`：ESLint 基础配置（TS + React）
  - `.prettierrc`：统一代码格式

- 构建与部署：
  - `vite.config.ts`：Vite 配置，`base` 在生产环境为 `'/'`，适配用户主页仓库
  - `.github/workflows/deploy.yml`：GitHub Actions 自动部署到 GitHub Pages
  - `docs/DEPLOYMENT.md`：部署到 `https://lesliewylie.github.io` 的详细说明

---

## 四、文档结构

- 根目录 `README.md`：面向使用者的总览文档
  - 项目简介、功能、使用指南、项目结构、数据格式、开发指南
  - 明确项目地址与在线演示链接

- `docs/`：
  - `README.md`：文档索引
  - `DEPLOYMENT.md`：部署到 GitHub Pages 的详细流程
  - `TROUBLESHOOTING.md`：故障排查
  - `OPTIMIZATION_RECOMMENDATIONS.md`：性能/安全/代码质量等技术优化建议
  - `UX_IMPROVEMENTS.md`：用户体验改进建议
  - `ARCHITECTURE.md`（当前文档）：架构与命名/文件管理规范

- `PROJECT_RESUME.md`：
  - 面向简历与作品集的项目说明，描述产品价值、角色与贡献

---

## 五、后续命名与文档维护建议

1. **新增模块时**：
   - 类型统一写入 `src/types.ts` 或新增 `types/` 子目录后集中导出。
   - 服务类逻辑放入 `src/services/`，命名为 `xxxService.ts` 或 `xxxClient.ts`。

2. **新增文档时**：
   - 放在 `docs/` 下，并在 `docs/README.md` 中补充索引。
   - 面向用户的内容优先写在根 `README.md`，面向开发者/维护者写在 `docs/`。

3. **数据文件**：
   - 示例与教程数据 → `data/examples/`
   - 真实用户数据 → `data/Users_data/`，务必确保不会进入 Git 仓库。

通过以上约定，项目在「命名统一性、目录清晰度、文档可发现性」上会更加稳定，也更方便未来持续迭代和协作开发。+









