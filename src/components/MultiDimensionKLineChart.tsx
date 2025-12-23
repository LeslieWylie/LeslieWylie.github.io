import React, { useMemo, useState } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AnalysisData, KLinePoint } from '../types';
import { ScrollText, Briefcase, Coins, Heart, Activity, Users } from 'lucide-react';

interface MultiDimensionKLineChartProps {
  data: KLinePoint[];
  analysis: AnalysisData;
  userName?: string;
}

interface DimensionConfig {
  key: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  overallScore: number; // 0-100
}

const MultiDimensionKLineChart: React.FC<MultiDimensionKLineChartProps> = ({
  data,
  analysis,
  userName,
}) => {
  const [activeDimensions, setActiveDimensions] = useState<string[]>([
    'summary',
    'career',
    'wealth',
    'marriage',
    'health',
    'family',
  ]);

  if (!data || data.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center text-gray-400 text-sm">
        暂无数据，生成一次报告后即可查看各维度K线走势
      </div>
    );
  }

  const dimensions: DimensionConfig[] = [
    {
      key: 'summary',
      name: '总评',
      color: '#6366f1',
      icon: ScrollText,
      overallScore: (analysis.summaryScore ?? 0) * 10,
    },
    {
      key: 'career',
      name: '事业',
      color: '#3b82f6',
      icon: Briefcase,
      overallScore: (analysis.industryScore ?? 0) * 10,
    },
    {
      key: 'wealth',
      name: '财富',
      color: '#f59e0b',
      icon: Coins,
      overallScore: (analysis.wealthScore ?? 0) * 10,
    },
    {
      key: 'marriage',
      name: '感情',
      color: '#ec4899',
      icon: Heart,
      overallScore: (analysis.marriageScore ?? 0) * 10,
    },
    {
      key: 'health',
      name: '健康',
      color: '#10b981',
      icon: Activity,
      overallScore: (analysis.healthScore ?? 0) * 10,
    },
    {
      key: 'family',
      name: '六亲',
      color: '#8b5cf6',
      icon: Users,
      overallScore: (analysis.familyScore ?? 0) * 10,
    },
  ];

  // 基于「整体K线年度分数 + 各维度总评」合成各维度年度曲线（仅做趋势拆分，可视化用）
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

        // 1）先把整体年度分向该维度目标分「拉近」一些
        //   - alpha 控制整体走势的保留程度（0.7：更贴近整体K线）
        const alpha = 0.7;
        const blended = overallYearScore * alpha + dimTarget * (1 - alpha);

        // 2）根据年份和维度 key 生成一个稳定的轻微扰动（保证不同维度线条不完全重合）
        const seed = (point.year * 13 + dim.key.length * 17) % 11; // 0-10
        const variation = (seed - 5) * 0.8; // -4 ~ +4 分的小波动

        const raw = blended + variation;
        const clamped = Math.max(0, Math.min(100, raw));
        result[dim.key] = Number(clamped.toFixed(1));
      });

      return result;
    });
  }, [data, dimensions]);

  const toggleDimension = (key: string) => {
    setActiveDimensions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const avgScores = dimensions.map((d) => d.overallScore || 0);
  const overallAvg =
    avgScores.reduce((sum, s) => sum + s, 0) / Math.max(avgScores.length, 1);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-600 rounded-full" />
            多维度人生K线走势图
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            基于整体 K 线走势和各维度评分，对
            <span className="font-semibold text-indigo-600"> 总评、事业、财富、感情、健康、六亲 </span>
            进行拆分，帮助你从多个角度看懂人生节奏。
          </p>
        </div>
        <div className="text-xs text-gray-500 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
          <div className="font-semibold text-purple-700 mb-0.5">
            当前整体平均分：{overallAvg.toFixed(1)} / 100
          </div>
          <div className="text-[11px] text-purple-600">
            线条为可视化拆分，并非精确命理结果，供趋势参考。
          </div>
        </div>
      </div>

      {/* 维度选择 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {dimensions.map((dim) => {
          const Icon = dim.icon;
          const active = activeDimensions.includes(dim.key);
          return (
            <button
              key={dim.key}
              type="button"
              onClick={() => toggleDimension(dim.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs md:text-sm transition-all ${
                active
                  ? 'bg-white border-purple-500 text-purple-700 shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-600' : 'text-gray-400'}`} />
              <span>{dim.name}</span>
              {active && (
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: dim.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 图表 */}
      <div className="w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 24, left: 8, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              label={{
                value: '年龄',
                position: 'insideBottomRight',
                offset: -5,
                fontSize: 10,
                fill: '#9ca3af',
              }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: '各维度运势分',
                angle: -90,
                position: 'insideLeft',
                fontSize: 10,
                fill: '#9ca3af',
              }}
            />
            <Tooltip
              formatter={(value: any, key: any) => {
                const dim = dimensions.find((d) => d.key === key);
                return [`${value} 分`, dim?.name ?? key];
              }}
              labelFormatter={(label: any) =>
                userName ? `${userName} · ${label} 岁` : `${label} 岁`
              }
            />
            <Legend
              formatter={(value) => {
                const dim = dimensions.find((d) => d.key === value);
                return dim ? dim.name : value;
              }}
              wrapperStyle={{ paddingTop: 8 }}
            />

            {dimensions.map((dim) =>
              activeDimensions.includes(dim.key) ? (
                <Line
                  key={dim.key}
                  type="monotone"
                  dataKey={dim.key}
                  stroke={dim.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={true}
                />
              ) : null
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-gray-500 mt-1">
        提示：上图基于整体人生 K 线和各维度评分做拆分，可帮助你从
        <span className="font-semibold text-indigo-600"> 财富、感情、事业、健康、六亲 </span>
        等多个角度回看过往、规划未来。
      </p>
    </div>
  );
};

export default MultiDimensionKLineChart;


