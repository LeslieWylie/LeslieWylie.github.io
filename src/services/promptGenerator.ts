import { BaziInput, Gender, PromptType } from '../types';

// Helper to determine stem polarity
const getStemPolarity = (pillar: string): 'YANG' | 'YIN' => {
  if (!pillar) return 'YANG';
  const firstChar = pillar.trim().charAt(0);
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  const yinStems = ['乙', '丁', '己', '辛', '癸'];
  
  if (yangStems.includes(firstChar)) return 'YANG';
  if (yinStems.includes(firstChar)) return 'YIN';
  return 'YANG';
};

// Prompt 缓存
const promptCache: Record<string, string> = {};

// 从文件加载 Prompt
const loadPromptFromFile = async (filename: string): Promise<string> => {
  // 如果缓存中有，直接返回
  if (promptCache[filename]) {
    return promptCache[filename];
  }

  try {
    const response = await fetch(`/prompts/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load prompt: ${filename}`);
    }
    const text = await response.text();
    promptCache[filename] = text.trim();
    return promptCache[filename];
  } catch (error) {
    console.error(`Error loading prompt ${filename}:`, error);
    // 返回默认提示
    return getDefaultFallbackPrompt();
  }
};

// 默认备用 Prompt（如果文件加载失败）
const getDefaultFallbackPrompt = (): string => {
  return `你是一位世界顶级的八字命理大师。你的任务是根据用户提供的四柱干支和**指定的大运信息**，生成一份"人生K线图"数据和带评分的命理报告。

**核心规则 (Core Rules):**
1. **年龄计算**: 严格采用**虚岁**，数据点必须**从 1 岁开始** (age: 1)。
2. **K线详批**: 每一年的 \`reason\` 必须是该流年的**详细批断**（100字左右），包含具体发生的吉凶事件预测、神煞分析、应对建议。
3. **评分机制**: 所有分析维度（总评、事业、财富等）需给出 0-10 分。

**输出 JSON 结构要求:**
{
  "bazi": ["年柱", "月柱", "日柱", "时柱"],
  "summary": "命理总评摘要。",
  "summaryScore": 8,
  "industry": "事业分析内容...",
  "industryScore": 7,
  "wealth": "财富分析内容...",
  "wealthScore": 9,
  "marriage": "婚姻分析内容...",
  "marriageScore": 6,
  "health": "健康分析内容...",
  "healthScore": 5,
  "family": "六亲分析内容...",
  "familyScore": 7,
  "chartPoints": [
    {
      "age": 1, 
      "year": 1990,
      "daYun": "童限", 
      "ganZhi": "庚午", 
      "open": 50,
      "close": 55,
      "high": 60,
      "low": 45,
      "score": 55,
      "reason": "详细的流年详批..."
    },
    ... (1-100岁)
  ]
}

**重要提示:**
- 请严格按照 JSON 格式输出，确保所有字段完整
- chartPoints 数组必须包含 100 个数据点（age: 1 到 100）
- 每个流年的 reason 字段必须详细（约 100 字）
- 所有评分必须在 0-10 之间`;
};

// 根据类型获取系统Prompt
const getSystemPromptByType = async (type: PromptType, customPrompt?: string): Promise<string> => {
  if (type === 'custom' && customPrompt) {
    return customPrompt;
  }
  
  switch (type) {
    case 'detailed':
      return await loadPromptFromFile('detailed.txt');
    case 'simple':
      return await loadPromptFromFile('simple.txt');
    case 'default':
    default:
      return await loadPromptFromFile('default.txt');
  }
};

/**
 * 生成完整的 Gemini Prompt
 * 包括系统角色设定和用户提示词
 */
export const generateGeminiPrompt = async (input: BaziInput): Promise<{ systemPrompt: string; userPrompt: string; fullPrompt: string }> => {
  const genderStr = input.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)';
  const startAgeInt = parseInt(input.startAge) || 1;
  const promptType = input.promptType || 'default';
  
  // Calculate Da Yun Direction
  const yearStemPolarity = getStemPolarity(input.yearPillar);
  let isForward = false;

  if (input.gender === Gender.MALE) {
    isForward = yearStemPolarity === 'YANG';
  } else {
    isForward = yearStemPolarity === 'YIN';
  }

  const daYunDirectionStr = isForward ? '顺行 (Forward)' : '逆行 (Backward)';
  
  const directionExample = isForward 
    ? "例如：第一步是【戊申】，第二步则是【己酉】（顺排）" 
    : "例如：第一步是【戊申】，第二步则是【丁未】（逆排）";

  // 获取系统Prompt（异步加载）
  const systemPrompt = await getSystemPromptByType(promptType, input.customPrompt);

  const userPrompt = `请根据以下**已经排好的**八字四柱和**指定的大运信息**进行分析。

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
- **daYun 字段**：必须填大运干支（10年不变），**绝对不要**填流年干支。
- **ganZhi 字段**：填入该年份的**流年干支**（每年一变，例如 2024=甲辰，2025=乙巳）。
- **year 字段**：填入对应的阳历年份（1岁=${input.birthYear}年，2岁=${parseInt(input.birthYear) + 1}年，以此类推）。

任务：
1. 确认格局与喜忌。
2. 生成 **1-100 岁 (虚岁)** 的人生流年K线数据。
3. 在 \`reason\` 字段中提供流年详批。
4. 生成带评分的命理分析报告。

请严格按照系统指令生成 JSON 数据。`;

  const fullPrompt = `## 系统角色设定（第一步发送给 Gemini）

\`\`\`
${systemPrompt}
\`\`\`

---

## 用户提示词（第二步发送给 Gemini）

\`\`\`
${userPrompt}
\`\`\`

---

## 使用说明

1. 将上面的"系统角色设定"复制发送给 Gemini
2. 等待 Gemini 确认后，再发送"用户提示词"
3. Gemini 会返回 JSON 格式的分析结果
4. 将返回的 JSON 保存为文件，然后在本页面上传即可查看 K 线图`;

  return {
    systemPrompt,
    userPrompt,
    fullPrompt
  };
};
