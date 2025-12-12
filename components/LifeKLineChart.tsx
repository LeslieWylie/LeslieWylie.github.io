import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ErrorBar
} from 'recharts';
import { KLinePoint } from '../types';

interface LifeKLineChartProps {
  data: KLinePoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as KLinePoint;
    const isUp = data.close >= data.open;
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <p className="font-bold text-gray-800">{`年龄: ${data.age}岁 (${data.year}年)`}</p>
        <div className={`text-sm my-1 ${isUp ? 'text-green-600' : 'text-red-600'} font-medium`}>
          {isUp ? '▲ 运势上涨' : '▼ 运势下跌'}
        </div>
        <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-600 mt-2">
          <span>开盘: {data.open}</span>
          <span>收盘: {data.close}</span>
          <span>最高: {data.high}</span>
          <span>最低: {data.low}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic max-w-[200px] border-t pt-2">
          {data.reason}
        </p>
      </div>
    );
  }
  return null;
};

// Custom shape to draw the candle body precisely
const CandleBody = (props: any) => {
  const { x, y, width, height, payload } = props;
  const isUp = payload.close >= payload.open;
  
  // US Market: Green = Up, Red = Down
  const fill = isUp ? '#22c55e' : '#ef4444'; 
  
  // If no movement (doji), draw a thin line
  const effectiveHeight = height === 0 ? 1 : height;
  
  return (
    <rect x={x} y={y} width={width} height={effectiveHeight} fill={fill} rx={1} />
  );
};

const LifeKLineChart: React.FC<LifeKLineChartProps> = ({ data }) => {
  // Transform data for Recharts:
  const transformedData = data.map(d => ({
    ...d,
    // [min, max] for the body of the candle
    bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    // Center point for the error bar (wick)
    middle: (d.high + d.low) / 2,
  }));

  return (
    <div className="w-full h-[500px] bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">人生流年K线图 (0-100岁)</h3>
        <div className="flex gap-4 text-xs">
           <span className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div> 上涨 (吉运)</span>
           <span className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div> 下跌 (凶运)</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={transformedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="age" 
            label={{ value: '年龄', position: 'insideBottomRight', offset: -5 }} 
            tick={{fontSize: 12}}
            interval={9} // Show every 10 years approx
          />
          <YAxis 
            domain={[0, 100]} 
            label={{ value: '运势指数', angle: -90, position: 'insideLeft' }} 
            tick={{fontSize: 12}}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          
          <Bar 
            dataKey="bodyRange" 
            shape={(props: any) => {
                const { x, y, width, height, payload, yAxis } = props;
                // Calculate coordinates manually based on scale
                const scale = yAxis.scale;
                
                const openY = scale(payload.open);
                const closeY = scale(payload.close);
                const highY = scale(payload.high);
                const lowY = scale(payload.low);
                
                const isUp = payload.close >= payload.open;
                const color = isUp ? '#22c55e' : '#ef4444'; // Green Up, Red Down (US Style requested)
                
                const bodyTop = Math.min(openY, closeY);
                const bodyBottom = Math.max(openY, closeY);
                const bodyHeight = Math.max(1, bodyBottom - bodyTop);
                
                const center = x + width / 2;

                return (
                  <g>
                    {/* Wick */}
                    <line x1={center} y1={highY} x2={center} y2={lowY} stroke={color} strokeWidth={1} />
                    {/* Body */}
                    <rect x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} />
                  </g>
                );
            }} 
          />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LifeKLineChart;
