import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AnalysisData } from '../types';
import { Briefcase, Coins, Heart, Activity, Users, ScrollText } from 'lucide-react';

interface DimensionComparisonChartProps {
  analysis: AnalysisData;
}

const DimensionComparisonChart: React.FC<DimensionComparisonChartProps> = ({ analysis }) => {
  const dimensionData = [
    {
      dimension: '总评',
      score: analysis.summaryScore,
      fullMark: 10,
      icon: ScrollText,
      color: '#6366f1',
    },
    {
      dimension: '事业',
      score: analysis.industryScore,
      fullMark: 10,
      icon: Briefcase,
      color: '#3b82f6',
    },
    {
      dimension: '财富',
      score: analysis.wealthScore,
      fullMark: 10,
      icon: Coins,
      color: '#f59e0b',
    },
    {
      dimension: '婚姻',
      score: analysis.marriageScore,
      fullMark: 10,
      icon: Heart,
      color: '#ec4899',
    },
    {
      dimension: '健康',
      score: analysis.healthScore,
      fullMark: 10,
      icon: Activity,
      color: '#10b981',
    },
    {
      dimension: '六亲',
      score: analysis.familyScore,
      fullMark: 10,
      icon: Users,
      color: '#8b5cf6',
    },
  ];

  const chartData = dimensionData.map(d => ({
    dimension: d.dimension,
    score: d.score,
    fullMark: d.fullMark,
  }));

  // 计算平均分
  const avgScore = dimensionData.reduce((sum, d) => sum + d.score, 0) / dimensionData.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">多维度对比分析</h3>
        <p className="text-sm text-gray-600">
          综合平均分：<span className="font-bold text-indigo-600">{avgScore.toFixed(1)}</span> / 10分
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 雷达图 */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-4">雷达图对比</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <Radar
                name="评分"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 详细列表 */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-4">维度详情</h4>
          <div className="space-y-3">
            {dimensionData.map((item, index) => {
              const Icon = item.icon;
              const percentage = (item.score / item.fullMark) * 100;
              
              // 根据分数确定颜色
              let barColor = '#ef4444'; // 红色
              if (percentage >= 80) barColor = '#10b981'; // 绿色
              else if (percentage >= 60) barColor = '#3b82f6'; // 蓝色
              else if (percentage >= 40) barColor = '#f59e0b'; // 黄色

              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: item.color }}
                        />
                      </div>
                      <span className="font-bold text-gray-800">{item.dimension}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">评分：</span>
                      <span
                        className="text-lg font-bold"
                        style={{ color: barColor }}
                      >
                        {item.score}
                      </span>
                      <span className="text-sm text-gray-400">/ 10</span>
                    </div>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                  
                  {/* 等级标签 */}
                  <div className="mt-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${barColor}20`,
                        color: barColor,
                      }}
                    >
                      {percentage >= 80
                        ? '优秀'
                        : percentage >= 60
                        ? '良好'
                        : percentage >= 40
                        ? '一般'
                        : '较差'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 分析建议 */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h4 className="text-sm font-bold text-indigo-900 mb-2">分析建议</h4>
        <div className="text-sm text-indigo-800 space-y-1">
          {dimensionData
            .filter(d => d.score < 6)
            .map((item, index) => (
              <p key={index}>
                • <strong>{item.dimension}</strong>维度评分较低（{item.score}分），
                建议重点关注此方面的改善和规划。
              </p>
            ))}
          {dimensionData.filter(d => d.score < 6).length === 0 && (
            <p>各维度评分均衡，整体运势良好，继续保持！</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DimensionComparisonChart;

