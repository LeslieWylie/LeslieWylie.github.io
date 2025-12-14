import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Brush,
} from 'recharts';
import { KLinePoint } from '../types';
import { RotateCcw, Filter, TrendingUp, Award } from 'lucide-react';

interface EnhancedKLineChartProps {
  data: KLinePoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as KLinePoint;
    const isUp = data.close >= data.open;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-2xl border border-gray-200 z-50 w-[320px] md:w-[400px]">
        <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
          <div>
            <p className="text-xl font-bold text-gray-800 font-serif-sc">
              {data.year} {data.ganZhi}年 <span className="text-base text-gray-500 font-sans">({data.age}岁)</span>
            </p>
            <p className="text-sm text-indigo-600 font-medium mt-1">
              大运：{data.daYun || '未知'}
            </p>
          </div>
          <div className={`text-base font-bold px-2 py-1 rounded ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isUp ? '吉 ▲' : '凶 ▼'}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
          <div className="text-center">
            <span className="block scale-90">开盘</span>
            <span className="font-mono text-gray-700 font-bold">{data.open}</span>
          </div>
          <div className="text-center">
            <span className="block scale-90">收盘</span>
            <span className="font-mono text-gray-700 font-bold">{data.close}</span>
          </div>
          <div className="text-center">
            <span className="block scale-90">最高</span>
            <span className="font-mono text-gray-700 font-bold">{data.high}</span>
          </div>
          <div className="text-center">
            <span className="block scale-90">最低</span>
            <span className="font-mono text-gray-700 font-bold">{data.low}</span>
          </div>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed text-justify max-h-[200px] overflow-y-auto custom-scrollbar">
          {data.reason}
        </div>
      </div>
    );
  }
  return null;
};

const CandleShape = (props: any) => {
  const { x, y, width, height, payload, yAxis } = props;
  const isUp = payload.close >= payload.open;
  const color = isUp ? '#22c55e' : '#ef4444';
  const strokeColor = isUp ? '#16a34a' : '#dc2626';
  
  let highY = y;
  let lowY = y + height;

  if (yAxis && typeof yAxis.scale === 'function') {
    try {
      highY = yAxis.scale(payload.high);
      lowY = yAxis.scale(payload.low);
    } catch (e) {
      highY = y;
      lowY = y + height;
    }
  }

  const center = x + width / 2;
  const renderHeight = height < 1 ? 1 : height;

  return (
    <g>
      <line x1={center} y1={highY} x2={center} y2={lowY} stroke={strokeColor} strokeWidth={1.5} />
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={renderHeight} 
        fill={color} 
        stroke={strokeColor}
        strokeWidth={0.5}
      />
    </g>
  );
};

const EnhancedKLineChart: React.FC<EnhancedKLineChartProps> = ({ data }) => {
  const [ageRange, setAgeRange] = useState<[number, number]>([1, 100]);
  const [showTrendLine, setShowTrendLine] = useState(true);
  const [showKeyYears, setShowKeyYears] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  // 计算移动平均线（MA）
  const calculateMA = (period: number) => {
    const ma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(NaN);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.score, 0);
        ma.push(sum / period);
      }
    }
    return ma;
  };

  // 识别关键年份（高分和低分）
  const keyYears = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.score - a.score);
    const top5 = sorted.slice(0, 5);
    const bottom5 = sorted.slice(-5);
    return {
      top: top5.map(d => ({ age: d.age, year: d.year, score: d.score, type: 'high' as const })),
      bottom: bottom5.map(d => ({ age: d.age, year: d.year, score: d.score, type: 'low' as const })),
    };
  }, [data]);

  // 过滤数据
  const filteredData = useMemo(() => {
    return data.filter(d => d.age >= ageRange[0] && d.age <= ageRange[1]);
  }, [data, ageRange]);

  // 添加移动平均线数据
  const chartData = useMemo(() => {
    const ma5 = calculateMA(5);
    const ma10 = calculateMA(10);
    return filteredData.map((d) => ({
      ...d,
      bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
      ma5: ma5[data.indexOf(d)],
      ma10: ma10[data.indexOf(d)],
    }));
  }, [filteredData, data]);

  // 大运变化点
  const daYunChanges = useMemo(() => {
    return filteredData.filter((d, i) => {
      if (i === 0) return true;
      const prevIndex = filteredData.findIndex(item => item.age === d.age - 1);
      if (prevIndex === -1) return true;
      return d.daYun !== filteredData[prevIndex].daYun;
    });
  }, [filteredData]);

  // 鼠标滚轮缩放
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!chartRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? 10 : -10;
      const range = ageRange[1] - ageRange[0];
      const newRange = Math.max(10, Math.min(100, range + delta));
      const center = (ageRange[0] + ageRange[1]) / 2;
      const newStart = Math.max(1, Math.min(100 - newRange, center - newRange / 2));
      const newEnd = Math.min(100, Math.max(1, newStart + newRange));
      setAgeRange([newStart, newEnd]);
    };

    const chartElement = chartRef.current;
    if (chartElement) {
      chartElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => chartElement.removeEventListener('wheel', handleWheel);
    }
  }, [ageRange]);

  if (!data || data.length === 0) {
    return <div className="h-[600px] flex items-center justify-center text-gray-400">无数据</div>;
  }

  return (
    <div ref={chartRef} className="w-full bg-white p-2 md:p-6 rounded-xl border border-gray-200 shadow-sm relative">
      {/* 工具栏 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800 font-serif-sc">人生流年大运K线图</h3>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* 时间范围选择 */}
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">年龄范围:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={ageRange[0]}
              onChange={(e) => setAgeRange([parseInt(e.target.value) || 1, ageRange[1]])}
              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-xs text-gray-400">-</span>
            <input
              type="number"
              min="1"
              max="100"
              value={ageRange[1]}
              onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value) || 100])}
              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={() => setAgeRange([1, 100])}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="重置范围"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* 显示选项 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTrendLine(!showTrendLine)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                showTrendLine
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              趋势线
            </button>
            <button
              onClick={() => setShowKeyYears(!showKeyYears)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                showKeyYears
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Award className="w-4 h-4 inline mr-1" />
              关键年份
            </button>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="mb-4 flex gap-4 text-xs font-medium px-2">
        <span className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-green-500 mr-2 rounded-full"></div> 吉运 (涨)
        </span>
        <span className="flex items-center text-red-700 bg-red-50 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-red-500 mr-2 rounded-full"></div> 凶运 (跌)
        </span>
        {showTrendLine && (
          <>
            <span className="flex items-center text-blue-700 bg-blue-50 px-2 py-1 rounded">
              <div className="w-2 h-2 bg-blue-500 mr-2 rounded-full"></div> MA5
            </span>
            <span className="flex items-center text-purple-700 bg-purple-50 px-2 py-1 rounded">
              <div className="w-2 h-2 bg-purple-500 mr-2 rounded-full"></div> MA10
            </span>
          </>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={600}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          
          <XAxis 
            dataKey="age" 
            tick={{fontSize: 10, fill: '#6b7280'}}
            interval={Math.floor((ageRange[1] - ageRange[0]) / 20)}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            label={{ value: '年龄', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#9ca3af' }}
            domain={[ageRange[0], ageRange[1]]}
          />
          
          <YAxis 
            domain={[0, 100]} 
            tick={{fontSize: 10, fill: '#6b7280'}}
            axisLine={false}
            tickLine={false}
            label={{ value: '运势分', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9ca3af' }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
          {/* 大运分界线 */}
          {daYunChanges.map((point) => (
            <ReferenceLine 
              key={`dayun-${point.age}`} 
              x={point.age} 
              stroke="#cbd5e1" 
              strokeDasharray="3 3" 
              strokeWidth={1}
            >
              <Label 
                value={point.daYun} 
                position="top" 
                fill="#6366f1" 
                fontSize={10} 
                fontWeight="bold"
                className="hidden md:block"
              />
            </ReferenceLine>
          ))}

          {/* 关键年份标记 */}
          {showKeyYears && (
            <>
              {keyYears.top.map((item) => (
                <ReferenceLine
                  key={`high-${item.age}`}
                  x={item.age}
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                >
                  <Label
                    value={`${item.year}年 (${item.score}分)`}
                    position="top"
                    fill="#10b981"
                    fontSize={9}
                    fontWeight="bold"
                  />
                </ReferenceLine>
              ))}
              {keyYears.bottom.map((item) => (
                <ReferenceLine
                  key={`low-${item.age}`}
                  x={item.age}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                >
                  <Label
                    value={`${item.year}年 (${item.score}分)`}
                    position="bottom"
                    fill="#ef4444"
                    fontSize={9}
                    fontWeight="bold"
                  />
                </ReferenceLine>
              ))}
            </>
          )}

          {/* K线 */}
          <Bar 
            dataKey="bodyRange" 
            shape={<CandleShape />} 
            isAnimationActive={true}
            animationDuration={1500}
          />

          {/* 移动平均线 */}
          {showTrendLine && (
            <>
              <Line
                type="monotone"
                dataKey="ma5"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="MA5"
              />
              <Line
                type="monotone"
                dataKey="ma10"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
                name="MA10"
              />
            </>
          )}

          {/* 时间范围选择器 */}
          <Brush
            dataKey="age"
            height={30}
            stroke="#6366f1"
            startIndex={Math.max(0, ageRange[0] - 1)}
            endIndex={Math.min(chartData.length - 1, ageRange[1] - 1)}
            onChange={(brushData: any) => {
              if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
                const startAge = chartData[brushData.startIndex]?.age || ageRange[0];
                const endAge = chartData[brushData.endIndex]?.age || ageRange[1];
                setAgeRange([startAge, endAge]);
              }
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 提示 */}
      <div className="mt-2 text-xs text-gray-500 px-2">
        💡 提示：使用鼠标滚轮可以缩放图表，拖动底部滑块可以快速选择时间范围
      </div>
    </div>
  );
};

export default EnhancedKLineChart;

