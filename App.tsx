import React, { useState } from 'react';
import BaziForm from './components/BaziForm';
import LifeKLineChart from './components/LifeKLineChart';
import AnalysisResult from './components/AnalysisResult';
import { UserInput, LifeDestinyResult } from './types';
import { generateLifeAnalysis } from './services/geminiService';
import { API_STATUS } from './constants';
import { Sparkles, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LifeDestinyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    // 检查系统状态
    if (API_STATUS === 0) {
      setError("当前服务器繁忙，使用的用户过多导致API堵塞，请择时再来");
      // 滚动到错误信息处 (可选，但为了确保用户看到)
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await generateLifeAnalysis(data);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "命理测算过程中发生了意外错误，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <div className="flex items-center gap-6">
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
            <div className="text-center max-w-2xl flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-serif-sc font-bold text-gray-900 mb-6">
                洞悉命运起伏 <br/>
                <span className="text-indigo-600">预见人生轨迹</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                结合传统<strong>八字命理</strong>与现代金融数据可视化，
                我们将您的一生运势绘制成类似股票行情的K线图。
                助您发现人生牛市，规避风险熊市，把握关键转折点。
              </p>

              {/* Large Tutorial Link */}
              <a 
                href="https://lsgljam25eq6.sg.larksuite.com/wiki/TVWLw1I9yiwPeKkZNoNlxsDMgNh"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-md border-2 border-indigo-100 hover:border-indigo-500 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                    查看使用教程
                  </div>
                  <div className="text-xs text-gray-400 font-medium group-hover:text-indigo-400">
                    新手必读指南 →
                  </div>
                </div>
              </a>
            </div>
            
            <BaziForm onSubmit={handleFormSubmit} isLoading={loading} />

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 max-w-md w-full animate-bounce-short">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Results View */}
        {result && (
          <div className="animate-fade-in space-y-12">
            
            <div className="flex justify-between items-center border-b pb-4">
               <h2 className="text-2xl font-bold font-serif-sc text-gray-800">命盘分析报告</h2>
               <button 
                 onClick={() => setResult(null)}
                 className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
               >
                 ← 重新排盘
               </button>
            </div>

            {/* The Chart */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                 <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                 百岁流年走势图 (100年)
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                <span className="text-green-600 font-bold">绿色K线</span> 代表运势上涨（吉），
                <span className="text-red-600 font-bold">红色K线</span> 代表运势下跌（凶）。
                (点击K线查看流年详批)
              </p>
              <LifeKLineChart data={result.chartData} />
            </section>

            {/* The Text Report */}
            <section>
               <AnalysisResult analysis={result.analysis} />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 人生K线项目 推特@0xsakura666 | 仅供娱乐与文化研究，请勿迷信</p>
        </div>
      </footer>
    </div>
  );
};

export default App;