import React, { useState } from 'react';
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
import { useToast } from './hooks/useToast';
import { saveToHistory } from './utils/storage';
import { Sparkles, History } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<LifeDestinyResult | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptData, setPromptData] = useState<{ systemPrompt: string; userPrompt: string } | null>(null);
  const [baziInput, setBaziInput] = useState<BaziInput | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const toast = useToast();

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
    } catch (error) {
      console.error('加载 Prompt 失败:', error);
      toast.error('加载 Prompt 失败，请刷新页面重试');
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  const handleFileUpload = (data: LifeDestinyResult) => {
    setResult(data);
    setShowPrompt(false);
    
    // 保存到历史记录
    if (baziInput) {
      saveToHistory(baziInput, data);
    }
    
    toast.success('数据加载成功！');
  };

  const handleLoadHistory = (baziInput: BaziInput, result?: LifeDestinyResult) => {
    setBaziInput(baziInput);
    setUserName(baziInput.name || `${baziInput.birthYear}年 ${baziInput.yearPillar} ${baziInput.monthPillar} ${baziInput.dayPillar} ${baziInput.hourPillar}`);
    
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
          
          {/* If no result, show intro and form */}
          {!result && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-fade-in">
              <div className="text-center max-w-2xl flex flex-col items-center mb-4">
                <h2 className="text-4xl md:text-5xl font-serif-sc font-bold text-gray-900 mb-4">
                  洞悉命运起伏 <br/>
                  <span className="text-indigo-600">预见人生轨迹</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  结合<strong>传统八字命理</strong>与<strong>金融可视化技术</strong>
                  将您的一生运势绘制成类似股票行情的K线图。
                  助您发现人生牛市，规避风险熊市，把握关键转折点。
                </p>
              </div>
              
              <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
                {/* 左侧：表单 */}
                <div className="flex flex-col">
                  <BaziForm onGeneratePrompt={handleGeneratePrompt} />
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
                  <ExportButton result={result} userName={userName} />
                  <button 
                    onClick={handleReset}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    ← 重新排盘
                  </button>
                </div>
              </div>

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
                <EnhancedKLineChart data={result.chartData} />
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
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full bg-gray-900 text-gray-400 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} 人生K线项目  | 仅供娱乐与文化研究，请勿迷信</p>
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

        {/* History Panel */}
        <HistoryPanel
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onLoadHistory={handleLoadHistory}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
