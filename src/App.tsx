import React, { useState, useMemo } from 'react';
import BaziForm from './components/BaziForm';
import EnhancedKLineChart from './components/EnhancedKLineChart';
import AnalysisResult from './components/AnalysisResult';
import StatisticsPanel from './components/StatisticsPanel';
import DimensionComparisonChart from './components/DimensionComparisonChart';
import PromptDisplay from './components/PromptDisplay';
import FileUpload from './components/FileUpload';
import LoadingSpinner from './components/LoadingSpinner';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import HistoryPanel from './components/HistoryPanel';
import ExportButton from './components/ExportButton';
import { BaziInput, LifeDestinyResult } from './types';
import { generateGeminiPrompt } from './services/promptGenerator';
import { logUsage } from './services/usageLogger';
import { useToast } from './hooks/useToast';
import { saveToHistory } from './utils/storage';
import { Sparkles, History, HelpCircle, Github, ExternalLink, ExternalLinkIcon, HeartHandshake, X } from 'lucide-react';
import HelpPage from './components/HelpPage';
import supportImg from '../money.png';

const App: React.FC = () => {
  const [result, setResult] = useState<LifeDestinyResult | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptData, setPromptData] = useState<{ systemPrompt: string; userPrompt: string } | null>(null);
  const [baziInput, setBaziInput] = useState<BaziInput | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const toast = useToast();

  // 推导当前步骤：1 填写八字，2 生成并复制 Prompt，3 上传/查看结果
  const currentStep = (() => {
    if (result) return 3;
    if (promptData && showPrompt) return 2;
    return 1;
  })();

  // 结果页整体概览文案
  const resultOverview = useMemo(() => {
    if (!result || !result.chartData || result.chartData.length === 0) return null;
    const scores = result.chartData.map(d => d.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const maxYear = result.chartData.find(d => d.score === max) || result.chartData[0];
    const minYear = result.chartData.find(d => d.score === min) || result.chartData[0];

    let tone = '整体运势中等偏上，起伏有度。';
    if (avg >= 75) tone = '整体运势偏吉，一生高光时刻较多。';
    else if (avg <= 50) tone = '整体运势略显坎坷，但关键阶段多有转机。';

    return {
      avgScore: Number(avg.toFixed(1)),
      maxYear,
      minYear,
      summaryText: tone,
    };
  }, [result]);

  const handleGeneratePrompt = async (data: BaziInput) => {
    setBaziInput(data);
    setShowPrompt(false);
    setIsLoadingPrompt(true);
    try {
      const prompts = await generateGeminiPrompt(data);
      setPromptData({
        systemPrompt: prompts.systemPrompt,
        userPrompt: prompts.userPrompt
      });
      setShowPrompt(true);
      setUserName(data.name || `${data.birthYear}年 ${data.yearPillar} ${data.monthPillar} ${data.dayPillar} ${data.hourPillar}`);
      toast.success('Prompt 生成成功！');

      logUsage({
        userId: data.name || undefined,
        account: data.name || undefined,
        operation: 'generatePrompt',
        pageData: {
          birthYear: data.birthYear,
          pillars: {
            year: data.yearPillar,
            month: data.monthPillar,
            day: data.dayPillar,
            hour: data.hourPillar,
          },
          promptType: data.promptType,
        },
      });
    } catch (error) {
      console.error('加载 Prompt 失败:', error);
      toast.error('加载 Prompt 失败，请刷新页面重试');
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  const handleFileUpload = (data: LifeDestinyResult) => {
    // 从数据中提取或使用 baziInput 中的姓名
    const extractedName = baziInput?.name || data.userName || '';
    if (extractedName) {
      data.userName = extractedName;
      setUserName(extractedName);
    }
    
    setResult(data);
    setShowPrompt(false);
    
    // 保存到历史记录
    if (baziInput) {
      saveToHistory(baziInput, data);
    }
    
    logUsage({
      userId: data.userName || extractedName || undefined,
      account: data.userName || extractedName || undefined,
      operation: 'uploadResult',
      pageData: {
        chartPoints: data.chartData?.length ?? 0,
        hasV2Data: Boolean(data.v2Data),
        baziInput: baziInput
          ? {
              birthYear: baziInput.birthYear,
              year: baziInput.yearPillar,
              month: baziInput.monthPillar,
              day: baziInput.dayPillar,
              hour: baziInput.hourPillar,
            }
          : undefined,
      },
    });

    toast.success('数据加载成功！');
  };

  const handleLoadHistory = (baziInput: BaziInput, result?: LifeDestinyResult) => {
    setBaziInput(baziInput);
    setUserName(baziInput.name || `${baziInput.birthYear}年 ${baziInput.yearPillar} ${baziInput.monthPillar} ${baziInput.dayPillar} ${baziInput.hourPillar}`);
    
    logUsage({
      userId: baziInput.name || undefined,
      account: baziInput.name || undefined,
      operation: 'loadHistory',
      pageData: {
        birthYear: baziInput.birthYear,
        year: baziInput.yearPillar,
        month: baziInput.monthPillar,
        day: baziInput.dayPillar,
        hour: baziInput.hourPillar,
        hasResult: Boolean(result),
      },
    });

    if (result) {
      setResult(result);
      toast.success('历史记录加载成功！');
    } else {
      // 如果没有结果，生成 Prompt
      handleGeneratePrompt(baziInput);
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowPrompt(false);
    setPromptData(null);
    setBaziInput(null);
    setUserName('');
  };

  // 轻量反馈：发送到日志系统
  const handleSendFeedback = async () => {
    const message = window.prompt('欢迎反馈使用体验或改进建议（可留空取消）：');
    if (!message || !message.trim()) return;
    logUsage({
      userId: baziInput?.name || userName || undefined,
      account: baziInput?.name || userName || undefined,
      operation: 'feedback',
      pageData: {
        message: message.trim(),
        hasResult: Boolean(result),
        timestamp: new Date().toISOString(),
      },
    });
    toast.success('感谢反馈，我们会认真参考你的建议。');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        {/* Header */}
        <header className="w-full bg-white border-b border-gray-200 py-6 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-2 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-serif-sc font-bold text-gray-900 tracking-wide">人生K线</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Life Destiny K-Line</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm"
                title="使用帮助"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden md:inline">使用帮助</span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-sm"
                title="查看历史记录"
              >
                <History className="w-5 h-5" />
                <span className="hidden md:inline">历史记录</span>
              </button>
              <div className="hidden md:block text-sm text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
                基于 AI 大模型驱动
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-12">

          {/* Multi-step Guide */}
          <section className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col gap-3">
              {/* 标题行：3 列居中对齐 */}
              <div className="grid grid-cols-3 text-center text-xs md:text-sm text-gray-500">
                <div className={currentStep >= 1 ? 'font-semibold text-indigo-600' : ''}>
                  第一步：填写八字信息
                </div>
                <div className={currentStep >= 2 ? 'font-semibold text-indigo-600' : ''}>
                  第二步：生成并复制 Gemini Prompt
                </div>
                <div className={currentStep >= 3 ? 'font-semibold text-indigo-600' : ''}>
                  第三步：上传 JSON 查看 K 线
                </div>
              </div>

              {/* 步骤圆点 + 连接线，与标题在同一列对齐 */}
              <div className="grid grid-cols-3 items-center mt-1">
                {[1, 2, 3].map((step, index) => (
                  <div key={step} className="flex items-center justify-center gap-2">
                    <div
                      className={[
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold',
                        step <= currentStep
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-500',
                      ].join(' ')}
                    >
                      {step}
                    </div>
                    {index < 2 && (
                      <div
                        className={[
                          'w-16 h-0.5 rounded-full',
                          step < currentStep ? 'bg-indigo-400' : 'bg-gray-200',
                        ].join(' ')}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center md:text-left">
                按照上方 3 个步骤依次完成：先在左侧填写八字排盘并生成 Prompt，复制后去 Gemini 对话，
                再将返回的 JSON 文件在右侧上传，即可查看人生 K 线图。
              </p>
            </div>
          </section>
          
          {/* If no result, show intro and form */}
          {!result && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-fade-in">
              <div className="text-center max-w-2xl flex flex-col items-center mb-4">
                <h2 className="text-4xl md:text-5xl font-serif-sc font-bold text-gray-900 mb-4">
                  洞悉命运起伏 <br/>
                  <span className="text-indigo-600">预见人生轨迹</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  结合<strong>传统八字命理</strong>与<strong>金融可视化技术</strong>
                  将您的一生运势绘制成类似股票行情的K线图。
                  助您发现人生牛市，规避风险熊市，把握关键转折点。
                </p>
                <button
                  onClick={() => setShowHelp(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                >
                  <HelpCircle className="w-4 h-4" />
                  查看使用帮助
                </button>
              </div>
              
              <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
                {/* 左侧：表单 */}
                <div className="flex flex-col">
                  <BaziForm onGeneratePrompt={handleGeneratePrompt} />

                  {/* 在线排盘推荐 */}
                  <div className="mt-4 bg-white border border-dashed border-indigo-200 rounded-lg p-3 space-y-2 shadow-sm">
                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                      <ExternalLinkIcon className="w-3 h-3 text-indigo-600" />
                      不会排盘？先在下列网站生成你的四柱干支：
                    </p>
                    <ul className="text-xs text-indigo-700 space-y-1 list-disc list-inside ml-1">
                      <li>
                        <a
                          href="https://bazi.goodsoul.live/paipan"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          好心灵八字排盘
                        </a>
                        （国内/海外时区支持良好）
                      </li>
                      <li>
                        <a
                          href="https://dao.qbb.me/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          轻便在线排盘（dao.qbb.me）
                        </a>
                        （适合快速查看四柱）
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 右侧：文件上传或加载状态 */}
                {!showPrompt && (
                  <div className="flex flex-col">
                    {isLoadingPrompt ? (
                      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner message="正在生成 Prompt..." size="lg" />
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">直接上传 JSON 文件</h3>
                          <p className="text-sm text-gray-500">
                            {baziInput 
                              ? '已生成 Prompt 并完成与 Gemini 的对话后，请上传返回的 JSON 文件'
                              : '如果您已有 JSON 结果文件，可以直接上传查看 K 线图'}
                          </p>
                        </div>
                        <FileUpload onUpload={handleFileUpload} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results View */}
          {result && (
            <div className="animate-fade-in space-y-12">
              
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold font-serif-sc text-gray-800">
                  {userName ? `${userName}的` : ''}命盘分析报告
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const shareText =
                        (result.v3Extras?.share?.short_summary as string | undefined) ||
                        (result.v3Extras?.share?.one_sentence as string | undefined);
                      if (!shareText) {
                        toast.info('当前结果不包含分享摘要，可直接复制页面内容进行分享。');
                        return;
                      }
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(shareText).then(
                          () => toast.success('分享摘要已复制到剪贴板'),
                          () => toast.error('复制失败，请手动选择文字复制')
                        );
                      } else {
                        toast.info('当前浏览器不支持一键复制，请手动选择文字复制。');
                      }
                    }}
                    className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                  >
                    <span>复制分享摘要</span>
                  </button>
                  <ExportButton result={result} userName={userName} />
                  <button
                    type="button"
                    onClick={() => setShowSupport(true)}
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <HeartHandshake className="w-3 h-3" />
                    <span>赞赏作者</span>
                  </button>
                  <button 
                    onClick={handleReset}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    ← 重新排盘
                  </button>
                </div>
              </div>

              {resultOverview && (
                <section className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50 border border-indigo-100 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-600 rounded-full" />
                      <h3 className="text-sm md:text-base font-bold text-gray-800">
                        人生运势整体概览
                      </h3>
                    </div>
                    <div className="text-xs text-gray-500">
                      平均得分 <span className="font-bold text-indigo-700">{resultOverview.avgScore}</span> / 100
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {(result.v3Extras?.summaryOverview?.trend_summary as string | undefined) ||
                      resultOverview.summaryText}
                  </p>
                  <p className="text-xs text-gray-500">
                    高光阶段集中在{' '}
                    <span className="font-semibold text-green-700">
                      {resultOverview.maxYear.year}年（{resultOverview.maxYear.age}岁，{resultOverview.maxYear.score}分）
                    </span>
                    ，
                    需要多加留意的低谷年份为{' '}
                    <span className="font-semibold text-red-700">
                      {resultOverview.minYear.year}年（{resultOverview.minYear.age}岁，{resultOverview.minYear.score}分）
                    </span>
                    ，结合详细批断提前做好规划。
                  </p>
                </section>
              )}

              {/* 关键 5 年摘要（基于 v3Extras.summaryOverview.key_5_years） */}
              {Array.isArray(result.v3Extras?.summaryOverview?.key_5_years) &&
                result.v3Extras!.summaryOverview!.key_5_years.length > 0 && (
                  <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2">
                      关键 5 年摘要
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {result.v3Extras!.summaryOverview!.key_5_years.map(
                        (item: any, index: number) => (
                          <div
                            key={`${item.year}-${item.age}-${index}`}
                            className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-gray-800">
                                {item.year}年（{item.age}岁）
                              </span>
                              {typeof item.score === 'number' && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                  {item.score}分
                                </span>
                              )}
                            </div>
                            {item.label && (
                              <p className="text-xs font-bold text-indigo-700 mb-1">
                                {item.label}
                              </p>
                            )}
                            {item.advice && (
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {item.advice}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* 未来 3 年/当前阶段聚焦（基于 v3Extras.futureFocus） */}
              {result.v3Extras?.futureFocus && (
                <section className="bg-white rounded-xl border border-emerald-100 shadow-sm p-5 space-y-4">
                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">
                    当前阶段与未来 3 年行动建议
                  </h3>
                  {result.v3Extras.futureFocus.current_age_focus && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-semibold text-emerald-800">
                        当前阶段：{result.v3Extras.futureFocus.current_age_focus.year}年（
                        {result.v3Extras.futureFocus.current_age_focus.age}岁）
                      </p>
                      {result.v3Extras.futureFocus.current_age_focus.summary && (
                        <p className="text-xs text-gray-700">
                          {result.v3Extras.futureFocus.current_age_focus.summary}
                        </p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {Array.isArray(
                          result.v3Extras.futureFocus.current_age_focus.top_risks
                        ) && (
                          <div>
                            <p className="font-semibold text-red-700 mb-1">主要风险</p>
                            <ul className="list-disc list-inside space-y-0.5 text-red-700">
                              {result.v3Extras.futureFocus.current_age_focus.top_risks.map(
                                (r: string, i: number) => (
                                  <li key={i}>{r}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        {Array.isArray(
                          result.v3Extras.futureFocus.current_age_focus.top_opportunities
                        ) && (
                          <div>
                            <p className="font-semibold text-green-700 mb-1">主要机会</p>
                            <ul className="list-disc list-inside space-y-0.5 text-green-700">
                              {result.v3Extras.futureFocus.current_age_focus.top_opportunities.map(
                                (r: string, i: number) => (
                                  <li key={i}>{r}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {Array.isArray(result.v3Extras.futureFocus.next_3_years) && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">
                        未来 3 年重点年份：
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {result.v3Extras.futureFocus.next_3_years.map(
                          (item: any, index: number) => (
                            <div
                              key={`${item.year}-${item.age}-${index}`}
                              className="p-3 rounded-lg border border-gray-100 bg-gray-50"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-gray-800">
                                  {item.year}年（{item.age}岁）
                                </span>
                                {Array.isArray(item.theme) && item.theme.length > 0 && (
                                  <span className="text-[11px] text-indigo-600">
                                    {item.theme.join(' / ')}
                                  </span>
                                )}
                              </div>
                              {item.summary && (
                                <p className="text-[11px] text-gray-700 mb-1">
                                  {item.summary}
                                </p>
                              )}
                              {Array.isArray(item.suggestions) && item.suggestions.length > 0 && (
                                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-600">
                                  {item.suggestions.map((s: string, i: number) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {(result.v3Extras.futureFocus.next_5_years_brief ||
                    result.v3Extras.futureFocus.next_10_years_brief) && (
                    <div className="text-[11px] text-gray-600 space-y-1 border-t border-gray-100 pt-2">
                      {result.v3Extras.futureFocus.next_3_years_brief && (
                        <p>未来 3–5 年：{result.v3Extras.futureFocus.next_5_years_brief}</p>
                      )}
                      {result.v3Extras.futureFocus.next_10_years_brief && (
                        <p>未来 10 年：{result.v3Extras.futureFocus.next_10_years_brief}</p>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* Enhanced K-Line Chart */}
              <section className="space-y-4" data-export-chart>
                <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                  流年大运走势图 (100年)
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="text-green-600 font-bold">绿色K线</span> 代表运势上涨（吉），
                  <span className="text-red-600 font-bold">红色K线</span> 代表运势下跌（凶）。
                  (点击K线查看流年详批，使用鼠标滚轮缩放)
                </p>
                <EnhancedKLineChart data={result.chartData} userName={result.userName || userName} />
              </section>

              {/* Bazi Pillars - 四柱信息 */}
              <section className="animate-fade-in">
                <div className="flex justify-center gap-2 md:gap-8 bg-gray-900 text-amber-50 p-6 rounded-xl shadow-lg overflow-x-auto">
                  {result.analysis.bazi.map((pillar, index) => {
                    const labels = ['年柱', '月柱', '日柱', '时柱'];
                    return (
                      <div key={index} className="text-center min-w-[60px]">
                        <div className="text-xs text-gray-400 mb-1">{labels[index]}</div>
                        <div className="text-xl md:text-3xl font-serif-sc font-bold tracking-widest">{pillar}</div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Statistics Panel */}
              <section>
                <StatisticsPanel data={result.chartData} />
              </section>

              {/* Dimension Comparison Chart */}
              <section>
                <DimensionComparisonChart analysis={result.analysis} />
              </section>

              {/* The Text Report */}
              <section data-export-analysis>
                <AnalysisResult analysis={result.analysis} />
              </section>

              {/* 轻量反馈入口 */}
              <section className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSendFeedback}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  <span>对本次报告有想法？点此反馈</span>
                </button>
              </section>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full bg-gray-900 text-gray-400 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} 人生K线项目  | 仅供娱乐与文化研究，请勿迷信</p>
            <a
              href="https://github.com/LeslieWylie/LeslieWylie.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub 仓库</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </footer>

        {/* Prompt Display Modal */}
        {showPrompt && promptData && (
          <PromptDisplay
            systemPrompt={promptData.systemPrompt}
            userPrompt={promptData.userPrompt}
            onClose={() => {
              setShowPrompt(false);
            }}
          />
        )}

        {/* 赞赏支持弹窗（仅在有结果时使用更明显按钮触发） */}
        {showSupport && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 relative">
              <button
                onClick={() => setShowSupport(false)}
                className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100"
                aria-label="关闭赞赏弹窗"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                <h3 className="text-base md:text-lg font-bold text-gray-800">赞赏支持作者</h3>
              </div>
              <p className="text-xs text-gray-600">
                如果你觉得「人生K线」对你有帮助，欢迎扫码请作者喝一杯咖啡。赞赏完全自愿，不影响功能使用，你的支持会被用于继续维护和优化项目。
              </p>
              <div className="w-40 h-52 bg-white rounded-xl p-1 flex items-center justify-center mx-auto border border-gray-200">
                <img
                  src={supportImg}
                  alt="微信赞赏码"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <p className="text-[11px] text-gray-400 text-center">
                使用微信扫码赞赏 | 金额随意，心意最重要
              </p>
            </div>
          </div>
        )}

        {/* History Panel */}
        <HistoryPanel
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onLoadHistory={handleLoadHistory}
        />

        {/* Help Page */}
        {showHelp && (
          <HelpPage onClose={() => setShowHelp(false)} />
        )}

        {/* Toast Notifications */}
        <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
