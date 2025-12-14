import React, { useMemo } from 'react';
import { KLinePoint } from '../types';
import { BarChart3, TrendingUp, TrendingDown, Award, AlertTriangle, Calendar, Activity } from 'lucide-react';

interface StatisticsPanelProps {
  data: KLinePoint[];
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ data }) => {
  const statistics = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 过滤掉平盘年份（开盘价等于收盘价的年份）
    const validData = data.filter(d => d.open !== d.close);

    // 基础统计（只统计非平盘年份）
    const scores = validData.map(d => d.score);
    const avgScore = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    const minScore = scores.length > 0 ? Math.min(...scores) : 0;
    const maxYear = validData.find(d => d.score === maxScore) || data[0];
    const minYear = validData.find(d => d.score === minScore) || data[0];

    // 大运周期分析（只统计非平盘年份）
    const daYunStats: Record<string, { count: number; avgScore: number; years: number[] }> = {};
    validData.forEach(d => {
      const daYun = d.daYun || '童限';
      if (!daYunStats[daYun]) {
        daYunStats[daYun] = { count: 0, avgScore: 0, years: [] };
      }
      daYunStats[daYun].count++;
      daYunStats[daYun].avgScore += d.score;
      daYunStats[daYun].years.push(d.age);
    });

    Object.keys(daYunStats).forEach(key => {
      if (daYunStats[key].count > 0) {
        daYunStats[key].avgScore = daYunStats[key].avgScore / daYunStats[key].count;
      }
    });

    // 趋势分析（分段，只统计非平盘年份）
    const segments = [
      { name: '童年 (1-12岁)', data: validData.filter(d => d.age <= 12) },
      { name: '青少年 (13-24岁)', data: validData.filter(d => d.age > 12 && d.age <= 24) },
      { name: '青年 (25-36岁)', data: validData.filter(d => d.age > 24 && d.age <= 36) },
      { name: '中年 (37-48岁)', data: validData.filter(d => d.age > 36 && d.age <= 48) },
      { name: '中老年 (49-60岁)', data: validData.filter(d => d.age > 48 && d.age <= 60) },
      { name: '老年 (61-72岁)', data: validData.filter(d => d.age > 60 && d.age <= 72) },
      { name: '高龄 (73-84岁)', data: validData.filter(d => d.age > 72 && d.age <= 84) },
      { name: '高寿 (85-100岁)', data: validData.filter(d => d.age > 84) },
    ];

    const segmentStats = segments.map(seg => ({
      name: seg.name,
      avgScore: seg.data.length > 0 
        ? seg.data.reduce((sum, d) => sum + d.score, 0) / seg.data.length 
        : 0,
      count: seg.data.length,
    }));

    // 关键转折点（分数变化超过20的年份，只统计非平盘年份）
    const turningPoints = [];
    for (let i = 1; i < validData.length; i++) {
      const prev = validData[i - 1];
      const curr = validData[i];
      const change = curr.score - prev.score;
      if (Math.abs(change) >= 20) {
        turningPoints.push({
          age: curr.age,
          year: curr.year,
          ganZhi: curr.ganZhi,
          change,
          fromScore: prev.score,
          toScore: curr.score,
          type: change > 0 ? 'up' : 'down',
        });
      }
    }

    // 运势等级分布（只统计非平盘年份）
    const scoreDistribution = {
      excellent: validData.filter(d => d.score >= 80).length,
      good: validData.filter(d => d.score >= 60 && d.score < 80).length,
      average: validData.filter(d => d.score >= 40 && d.score < 60).length,
      poor: validData.filter(d => d.score < 40).length,
    };

    // 上升/下降趋势统计（只统计非平盘年份）
    let upTrends = 0;
    let downTrends = 0;
    for (let i = 1; i < validData.length; i++) {
      if (validData[i].score > validData[i - 1].score) upTrends++;
      else if (validData[i].score < validData[i - 1].score) downTrends++;
    }

    return {
      avgScore: Number(avgScore.toFixed(2)),
      maxScore,
      minScore,
      maxYear,
      minYear,
      daYunStats,
      segmentStats,
      turningPoints: turningPoints.slice(0, 10), // 只显示前10个
      scoreDistribution,
      upTrends,
      downTrends,
      totalYears: data.length,
      validYears: validData.length, // 非平盘年份数量
    };
  }, [data]);

  if (!statistics) {
    return <div className="text-center text-gray-400 py-8">暂无统计数据</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-800">数据统计分析</h3>
      </div>

      {/* 基础统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700 font-medium">最高年份</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-800">
            {statistics.maxYear.year}年
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {statistics.maxYear.age}岁 · {statistics.maxScore}分
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-700 font-medium">最低年份</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-800">
            {statistics.minYear.year}年
          </p>
          <p className="text-xs text-red-600 mt-1">
            {statistics.minYear.age}岁 · {statistics.minScore}分
          </p>
        </div>
      </div>

      {/* 运势等级分布 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          运势等级分布
        </h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.scoreDistribution.excellent}</div>
            <div className="text-xs text-gray-600 mt-1">优秀 (≥80分)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.scoreDistribution.good}</div>
            <div className="text-xs text-gray-600 mt-1">良好 (60-79分)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statistics.scoreDistribution.average}</div>
            <div className="text-xs text-gray-600 mt-1">一般 (40-59分)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statistics.scoreDistribution.poor}</div>
            <div className="text-xs text-gray-600 mt-1">较差 (&lt;40分)</div>
          </div>
        </div>
      </div>

      {/* 趋势统计 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-green-700">上升趋势</span>
          </div>
          <p className="text-2xl font-bold text-green-800">{statistics.upTrends}</p>
          <p className="text-xs text-green-600 mt-1">年</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm font-bold text-red-700">下降趋势</span>
          </div>
          <p className="text-2xl font-bold text-red-800">{statistics.downTrends}</p>
          <p className="text-xs text-red-600 mt-1">年</p>
        </div>
      </div>

      {/* 人生阶段分析 */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          人生阶段运势分析
        </h4>
        <div className="space-y-2">
          {statistics.segmentStats.map((seg, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700 font-medium">{seg.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${seg.avgScore}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-800 w-12 text-right">
                  {seg.avgScore.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关键转折点 */}
      {statistics.turningPoints.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            关键转折点（变化≥20分）
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {statistics.turningPoints.map((point, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  point.type === 'up'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800">
                      {point.year}年 ({point.age}岁) {point.ganZhi}
                    </span>
                    <span className={`ml-2 text-sm font-bold ${
                      point.type === 'up' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {point.type === 'up' ? '↑' : '↓'} {Math.abs(point.change)}分
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {point.fromScore} → {point.toScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 大运周期分析 */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">大运周期分析</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {Object.entries(statistics.daYunStats)
            .sort((a, b) => b[1].avgScore - a[1].avgScore)
            .map(([daYun, stats]) => (
              <div key={daYun} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">{daYun}</span>
                  <span className="text-sm font-bold text-indigo-600">
                    {stats.avgScore.toFixed(1)}分
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600"
                      style={{ width: `${stats.avgScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {stats.count}年 ({Math.min(...stats.years)}-{Math.max(...stats.years)}岁)
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;

