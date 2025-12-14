import React, { useState } from 'react';
import { X, Book, Search, ChevronRight, HelpCircle, FileText, Code, BarChart3 } from 'lucide-react';

interface HelpPageProps {
  onClose: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'getting-started',
      title: '快速开始',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">欢迎使用人生K线</h3>
          <p className="text-gray-600">
            人生K线是一个创新的命理可视化工具，将传统八字命理学与现代金融 K 线图技术相结合。
            通过 AI 大模型分析您的生辰八字，生成 100 年的人生运势 K 线图。
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">📋 完整流程：</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>填写八字信息（四柱干支、大运等）</li>
              <li>生成 Prompt 并复制给 AI（推荐 Gemini，最佳替代：Kimi，也支持豆包、千问）</li>
              <li>上传 AI 返回的 JSON 结果文件</li>
              <li>查看可视化 K 线图和分析报告</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'input-guide',
      title: '输入指南',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">如何填写八字信息</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">什么是四柱干支？</h4>
              <p className="text-sm text-gray-600 mb-2">
                四柱由年柱、月柱、日柱、时柱组成，每个柱由<strong>天干+地支</strong>组成。
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li><strong>天干</strong>：甲、乙、丙、丁、戊、己、庚、辛、壬、癸（共10个）</li>
                <li><strong>地支</strong>：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥（共12个）</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <strong>示例</strong>：甲子、乙丑、丙寅、丁卯
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">如何获取我的八字？</h4>
              <p className="text-sm text-gray-600 mb-2">
                您可以使用以下方式获取八字信息：
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>使用专业的八字排盘工具，如：元亨利贞、问真八字（推荐）等</li>
                <li>咨询专业的命理师</li>
                <li>使用在线八字排盘网站</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">大运信息说明</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>起运年龄</strong>：指开始行大运的虚岁年龄（如：5岁、8岁等）
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>第一步大运</strong>：起运后第一步大运的干支（如：甲子、乙丑等）
              </p>
              <p className="text-sm text-gray-600">
                <strong>大运方向</strong>：系统会根据您的性别和年柱天干自动计算（顺行/逆行）
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">💡 批量输入功能</h4>
              <p className="text-sm text-green-800 mb-2">
                支持批量输入四柱信息，提高输入效率：
              </p>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>空格分隔：<code className="bg-green-100 px-1 rounded">甲子 乙丑 丙寅 丁卯</code></li>
                <li>完整格式：<code className="bg-green-100 px-1 rounded">年柱：甲子 月柱：乙丑 日柱：丙寅 时柱：丁卯</code></li>
                <li>换行分隔：每行一个柱</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'prompt-guide',
      title: 'Prompt 使用教程',
      icon: <Code className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">如何使用 Prompt</h3>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h4 className="font-bold text-indigo-900 mb-2">🤖 支持的 AI 平台</h4>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-indigo-800 mb-1">✅ Google Gemini（推荐）</p>
                <p className="text-sm text-indigo-700">
                  完全支持，可以输出完整的 JSON 数据。访问地址：<a href="https://gemini.google.com" target="_blank" className="underline">https://gemini.google.com</a>
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-300">
                <p className="font-semibold text-green-800 mb-1">⭐ 月之暗面 Kimi（最佳替代）</p>
                <p className="text-sm text-green-700 mb-2">
                  <strong>强烈推荐作为 Gemini 的最佳替代选择！</strong> Kimi 对长文本和复杂 JSON 输出支持非常好，几乎可以完美替代 Gemini。
                </p>
                <p className="text-sm text-green-700">
                  访问地址：<a href="https://kimi.moonshot.cn" target="_blank" className="underline font-semibold">https://kimi.moonshot.cn</a>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  💡 提示：Kimi 的长上下文能力特别适合生成完整的 100 年流年数据
                </p>
              </div>
              <div>
                <p className="font-semibold text-indigo-800 mb-1">⚠️ 字节豆包（可用）</p>
                <p className="text-sm text-indigo-700">
                  可以使用相同的 Prompt，但<strong>可能无法输出完整的 JSON 数据</strong>。
                  如果遇到输出不完整的情况，建议：
                </p>
                <ul className="text-sm text-indigo-700 mt-1 space-y-1 list-disc list-inside ml-4">
                  <li>要求 AI 继续输出完整内容</li>
                  <li>检查输出格式是否为有效 JSON</li>
                  <li>使用 Gemini 或 <strong>Kimi（推荐）</strong> 重新生成</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-indigo-800 mb-1">⚠️ 阿里通义千问（可用）</p>
                <p className="text-sm text-indigo-700">
                  可以使用相同的 Prompt，但输出质量可能不如 Gemini 和 Kimi。
                  如果遇到输出不完整或格式问题，建议：
                </p>
                <ul className="text-sm text-indigo-700 mt-1 space-y-1 list-disc list-inside ml-4">
                  <li>要求 AI 继续输出完整内容</li>
                  <li>检查输出格式是否为有效 JSON</li>
                  <li>优先使用 <strong>Kimi（最佳替代）</strong> 或 Gemini 重新生成</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">📋 使用步骤：</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>填写完八字信息后，点击"生成 Gemini Prompt"按钮</li>
              <li>在弹出的窗口中，复制"系统角色设定"内容</li>
              <li>打开 Gemini、Kimi（推荐替代）、豆包或千问，将系统角色设定发送给 AI</li>
              <li>等待 AI 确认理解角色后，复制"用户提示词"并发送</li>
              <li>AI 会返回 JSON 格式的分析结果</li>
              <li>将返回的 JSON 保存为文件（如：result.json）</li>
              <li>关闭 Prompt 窗口，在文件上传区域上传 JSON 文件</li>
              <li>系统会自动解析并显示 K 线图和分析报告</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-2">⚠️ 注意事项：</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>确保 AI 返回的是<strong>完整的 JSON 格式</strong>数据</li>
              <li>如果 JSON 不完整，可以要求 AI 继续输出</li>
              <li>建议使用 Gemini，输出质量更稳定</li>
              <li>如果使用豆包或千问遇到问题，<strong>强烈推荐使用 Kimi 作为最佳替代</strong>，输出质量接近 Gemini</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'result-view',
      title: '结果查看说明',
      icon: <BarChart3 className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">如何查看分析结果</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">📊 K 线图说明</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <span className="text-green-600 font-bold">绿色K线</span>：代表运势上涨（吉运）
                </li>
                <li>
                  <span className="text-red-600 font-bold">红色K线</span>：代表运势下跌（凶运）
                </li>
                <li><strong>点击K线</strong>：查看每年的详细流年批断</li>
                <li><strong>鼠标滚轮</strong>：缩放图表</li>
                <li><strong>底部滑块</strong>：快速选择时间范围</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">📈 统计分析</h4>
              <p className="text-sm text-gray-600">
                查看最高年份、最低年份、运势等级分布、趋势统计、人生阶段分析等详细数据。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">📋 分析报告</h4>
              <p className="text-sm text-gray-600">
                包含总评、事业、财富、婚姻、健康、六亲等 6 个维度的详细分析和评分。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">💾 导出功能</h4>
              <p className="text-sm text-gray-600">
                支持导出为 JSON、PNG 图片、PDF 文档，方便保存和分享。
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'faq',
      title: '常见问题',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">常见问题解答</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Q: 如何获取我的八字四柱？</h4>
              <p className="text-sm text-gray-600">
                A: 您可以使用专业的八字排盘工具或咨询命理师。也可以使用在线八字排盘网站，输入您的出生信息即可获得。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Q: 可以使用其他 AI 平台吗？</h4>
              <p className="text-sm text-gray-600 mb-2">
                A: 可以！系统支持多个 AI 平台：
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside ml-4">
                <li><strong>Gemini</strong>：推荐，输出质量最稳定</li>
                <li><strong>Kimi</strong>：<span className="text-green-600 font-bold">最佳替代选择</span>，长文本输出能力强，几乎可以完美替代 Gemini</li>
                <li><strong>豆包</strong>：可用，但可能无法输出完整的 JSON 数据</li>
                <li><strong>千问</strong>：可用，但输出质量可能不如 Gemini 和 Kimi</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                如果使用豆包或千问遇到输出不完整的情况，<strong>强烈建议使用 Kimi 作为替代</strong>，效果最好。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Q: JSON 文件格式不正确怎么办？</h4>
              <p className="text-sm text-gray-600">
                A: 请确保 AI 返回的是完整的 JSON 格式。如果 JSON 不完整，可以要求 AI 继续输出，或者重新生成。系统支持 V1、V2、V3 三种格式。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Q: 数据会保存吗？</h4>
              <p className="text-sm text-gray-600">
                A: 系统会自动将分析结果保存到浏览器本地存储（localStorage），您可以在"历史记录"中查看和重新加载。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Q: 支持移动端使用吗？</h4>
              <p className="text-sm text-gray-600">
                A: 支持，系统已针对移动端进行优化。建议横屏查看图表效果更佳。
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold font-serif-sc text-gray-800">使用帮助</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭帮助"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索帮助内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-indigo-600">{section.icon}</div>
                    <span className="font-semibold text-gray-800">{section.title}</span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === section.id ? 'transform rotate-90' : ''
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Active Section Content */}
            {activeSection && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {sections.find(s => s.id === activeSection)?.content}
              </div>
            )}

            {/* All Sections (when no active section) */}
            {!activeSection && (
              <div className="space-y-6">
                {filteredSections.map((section) => (
                  <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    {section.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              需要更多帮助？请查看项目文档或提交 Issue
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

