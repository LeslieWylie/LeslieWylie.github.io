import React from 'react';
import { AnalysisData } from '../types';
import { ScrollText, Briefcase, Coins, Heart, Activity, Users } from 'lucide-react';

interface AnalysisResultProps {
  analysis: AnalysisData;
}

const Card = ({ title, icon: Icon, content, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className={`flex items-center gap-2 mb-3 ${colorClass}`}>
      <Icon className="w-5 h-5" />
      <h3 className="font-serif-sc font-bold text-lg">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Bazi Pillars */}
      <div className="flex justify-center gap-4 md:gap-8 bg-gray-900 text-amber-50 p-6 rounded-xl shadow-lg">
        {analysis.bazi.map((pillar, index) => {
          const labels = ['年柱', '月柱', '日柱', '时柱'];
          return (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-400 mb-1">{labels[index]}</div>
              <div className="text-xl md:text-3xl font-serif-sc font-bold tracking-widest">{pillar}</div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
        <h3 className="flex items-center gap-2 font-serif-sc font-bold text-xl text-indigo-900 mb-4">
          <ScrollText className="w-5 h-5" />
          命理总评
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{analysis.summary}</p>
      </div>

      {/* Grid for categorical analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          title="事业行业" 
          icon={Briefcase} 
          content={analysis.industry} 
          colorClass="text-blue-600" 
        />
        <Card 
          title="财富层级" 
          icon={Coins} 
          content={analysis.wealth} 
          colorClass="text-amber-600" 
        />
        <Card 
          title="婚姻情感" 
          icon={Heart} 
          content={analysis.marriage} 
          colorClass="text-pink-600" 
        />
        <Card 
          title="身体健康" 
          icon={Activity} 
          content={analysis.health} 
          colorClass="text-emerald-600" 
        />
        <Card 
          title="六亲关系" 
          icon={Users} 
          content={analysis.family} 
          colorClass="text-purple-600" 
        />
      </div>

      {/* Detailed Timeline */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-serif-sc font-bold text-2xl text-gray-800 mb-6 border-b pb-4">
          大运流年详批
        </h3>
        <div className="prose prose-slate max-w-none text-gray-600 text-sm leading-7 whitespace-pre-wrap font-sans">
          {analysis.timeline}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
