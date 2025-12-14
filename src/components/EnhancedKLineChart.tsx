import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
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
import { RotateCcw, Filter, Award, Sparkles, ZoomIn, ZoomOut, Search, Maximize2, Minimize2 } from 'lucide-react';

interface EnhancedKLineChartProps {
  data: KLinePoint[];
  userName?: string; // 添加姓名参数
}

const CustomTooltip = ({ active, payload, userName }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as KLinePoint;
    const isUp = data.close >= data.open;
    const trend = data.trend || (isUp ? 'Bullish' : 'Bearish');
    
    // 趋势标签
    const trendLabels: Record<string, { text: string; color: string }> = {
      'Bullish': { text: '上涨', color: 'green' },
      'Bearish': { text: '下跌', color: 'red' },
    };
    
    const trendInfo = trendLabels[trend] || trendLabels['Bullish'];
    
    return (
      <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-2xl border border-gray-200 z-50 w-[380px] md:w-[450px]">
        {/* Header with Name */}
        {userName && (
          <div className="mb-3 pb-2 border-b border-gray-200">
            <p className="text-lg font-bold text-indigo-700 font-serif-sc">
              {userName}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
          <div>
            <p className="text-xl font-bold text-gray-800 font-serif-sc">
              {data.year} {data.ganZhi}年 <span className="text-base text-gray-500 font-sans">({data.age}岁)</span>
            </p>
            <p className="text-sm text-indigo-600 font-medium mt-1">
              大运：{data.daYun || '未知'}
            </p>
            {data.title && (
              <p className="text-sm font-bold text-gray-700 mt-1">
                {data.title}
              </p>
            )}
          </div>
          <div className={`text-base font-bold px-2 py-1 rounded ${
            trend === 'Bullish' ? 'bg-green-100 text-green-700' : 
            trend === 'Bearish' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-700'
          }`}>
            {trendInfo.text} {trend === 'Bullish' ? '▲' : trend === 'Bearish' ? '▼' : '→'}
          </div>
        </div>

        {/* K线数据 */}
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

        {/* V2 格式的扩展信息 */}
        {(data.tenGod || data.interaction?.length || data.shenSha?.length || data.energy) && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-800">命理信息</span>
            </div>
            <div className="space-y-1 text-xs text-indigo-700">
              {data.tenGod && (
                <div><span className="font-bold">十神：</span>{data.tenGod}</div>
              )}
              {data.interaction && data.interaction.length > 0 && (
                <div><span className="font-bold">冲合：</span>{data.interaction.join('、')}</div>
              )}
              {data.shenSha && data.shenSha.length > 0 && (
                <div><span className="font-bold">神煞：</span>{data.shenSha.join('、')}</div>
              )}
              {data.energy && (
                <div><span className="font-bold">五行：</span>{data.energy}</div>
              )}
            </div>
          </div>
        )}

        {/* 标签 */}
        {data.tags && data.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {data.tags.map((tag, index) => {
              const tagColors: Record<string, string> = {
                'Career': 'bg-blue-100 text-blue-700',
                'Wealth': 'bg-amber-100 text-amber-700',
                'Love': 'bg-pink-100 text-pink-700',
                'Health': 'bg-green-100 text-green-700',
                'Study': 'bg-purple-100 text-purple-700',
                'Safety': 'bg-red-100 text-red-700',
                'Travel': 'bg-cyan-100 text-cyan-700',
                'Family': 'bg-orange-100 text-orange-700',
              };
              return (
                <span
                  key={index}
                  className={`text-xs px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-100 text-gray-700'}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* 详细批断 */}
        <div className="text-sm text-gray-700 leading-relaxed text-justify max-h-[200px] overflow-y-auto custom-scrollbar mb-3">
          {data.reason || data.title || '暂无详细批断'}
        </div>

        {/* 改运建议和幸运信息 */}
        {(data.advice || data.luckyColor || data.luckyDirection) && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {data.advice && (
              <div className="mb-2 text-xs">
                <span className="font-bold text-indigo-700">💡 建议：</span>
                <span className="text-gray-700 ml-1">{data.advice}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {data.luckyColor && (
                <div>
                  <span className="font-bold">幸运色：</span>
                  <span className="ml-1">{data.luckyColor}</span>
                </div>
              )}
              {data.luckyDirection && (
                <div>
                  <span className="font-bold">幸运方位：</span>
                  <span className="ml-1">{data.luckyDirection}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CandleShape = (props: any) => {
  const { x, y, width, height, payload, yAxis } = props;
  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const trend = payload.trend || (isUp ? 'Bullish' : 'Bearish');
  
  // 根据趋势设置颜色（优化后的配色方案）
  let color = '#10b981'; // 更柔和的绿色（上涨）
  let strokeColor = '#059669'; // 更深的绿色边框
  let shadowColor = '#10b981'; // 影线颜色
  
  if (trend === 'Bearish') {
    color = '#f43f5e'; // 更柔和的红色（下跌）
    strokeColor = '#e11d48'; // 更深的红色边框
    shadowColor = '#f43f5e';
  } else if (isUp) {
    color = '#10b981'; // 绿色（上涨）
    strokeColor = '#059669';
    shadowColor = '#10b981';
  }
  
  // 使用 yAxis 的 scale 函数将数值转换为坐标
  // y 轴在 SVG 中是向下为正，所以数值越大，y 坐标越小
  const getYPosition = (value: number): number => {
    if (yAxis && typeof yAxis.scale === 'function') {
      try {
        return yAxis.scale(value);
      } catch (e) {
        // 如果 scale 失败，使用默认计算
        return y + height - ((value - Math.min(open, close)) / (Math.max(open, close) - Math.min(open, close) || 1)) * height;
      }
    }
    // 备用计算方式（不推荐，但作为后备）
    return y + height - ((value - Math.min(open, close)) / (Math.max(open, close) - Math.min(open, close) || 1)) * height;
  };

  // 计算各个关键点的 Y 坐标
  const highY = getYPosition(high);
  const lowY = getYPosition(low);
  const openY = getYPosition(open);
  const closeY = getYPosition(close);
  
  // 实体的顶部和底部（取 open 和 close 的较大值和较小值）
  const bodyTop = Math.min(openY, closeY); // 数值小（价格高）的在上面
  const bodyBottom = Math.max(openY, closeY); // 数值大（价格低）的在下面
  // 如果开盘价等于收盘价（平盘），实体高度设为 3px 以便可见
  const bodyHeight = Math.max(open === close ? 3 : 1, bodyBottom - bodyTop);

  // K 线的中心 X 坐标
  const centerX = x + width / 2;
  
  // 优化实体宽度比例：根据可用宽度动态调整
  // 当宽度较大时使用 50%，较小时使用 70%，确保最小 3px
  const bodyWidthRatio = width > 20 ? 0.5 : width > 10 ? 0.6 : 0.7;
  const bodyWidth = Math.max(3, Math.floor(width * bodyWidthRatio));
  const bodyX = x + (width - bodyWidth) / 2;

  // 判断是否需要上影线和下影线
  // 在 SVG 中，Y 坐标越小表示价格越高
  // 上影线：当最高价高于实体顶部时（highY < bodyTop）
  // 下影线：当最低价低于实体底部时（lowY > bodyBottom）
  const hasUpperShadow = highY < bodyTop;
  const hasLowerShadow = lowY > bodyBottom;

  // 优化影线粗细：根据实体宽度动态调整
  const shadowWidth = Math.max(1.2, Math.min(2, bodyWidth * 0.3));
  // 实体边框粗细：根据实体宽度动态调整
  const borderWidth = bodyWidth > 8 ? 1 : bodyWidth > 4 ? 0.8 : 0.5;
  // 圆角半径：根据实体宽度动态调整
  const borderRadius = Math.max(0.5, Math.min(2, bodyWidth * 0.15));

  return (
    <g>
      {/* 上影线：从最高价到实体顶部 */}
      {hasUpperShadow && (
        <line 
          x1={centerX} 
          y1={highY} 
          x2={centerX} 
          y2={bodyTop} 
          stroke={shadowColor} 
          strokeWidth={shadowWidth}
          strokeLinecap="round"
          opacity={0.9}
        />
      )}
      
      {/* 实体：开盘价和收盘价之间的矩形 */}
      <rect 
        x={bodyX} 
        y={bodyTop} 
        width={bodyWidth} 
        height={bodyHeight} 
        fill={color} 
        stroke={strokeColor}
        strokeWidth={borderWidth}
        rx={borderRadius}
        ry={borderRadius}
        opacity={0.95}
      />
      
      {/* 下影线：从实体底部到最低价 */}
      {hasLowerShadow && (
        <line 
          x1={centerX} 
          y1={bodyBottom} 
          x2={centerX} 
          y2={lowY} 
          stroke={shadowColor} 
          strokeWidth={shadowWidth}
          strokeLinecap="round"
          opacity={0.9}
        />
      )}
    </g>
  );
};

const EnhancedKLineChart: React.FC<EnhancedKLineChartProps> = ({ data, userName }) => {
  const [ageRange, setAgeRange] = useState<[number, number]>([1, 100]);
  const [showKeyYears, setShowKeyYears] = useState(true);
  const [searchAge, setSearchAge] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const chartRef = useRef<HTMLDivElement>(null);

  // 检测移动端
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 过滤数据
  const filteredData = useMemo(() => {
    return data.filter(d => d.age >= ageRange[0] && d.age <= ageRange[1]);
  }, [data, ageRange]);

  // 准备图表数据（用于图表显示）
  const chartData = useMemo(() => {
    return filteredData.map((d) => ({
      ...d,
      bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    }));
  }, [filteredData]);

  // 准备完整的图表数据（用于Brush组件，需要基于完整数据计算索引）
  const fullChartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    }));
  }, [data]);

  // 识别关键年份（高分和低分）- 基于当前过滤范围
  const keyYears = useMemo(() => {
    if (filteredData.length === 0) return { top: [], bottom: [] };
    
    const sorted = [...filteredData].sort((a, b) => b.close - a.close);
    const top5 = sorted.slice(0, 5);
    const bottom5 = sorted.slice(-5);
    return {
      top: top5.map(d => ({ age: d.age, year: d.year, score: d.close, type: 'high' as const })),
      bottom: bottom5.map(d => ({ age: d.age, year: d.year, score: d.close, type: 'low' as const })),
    };
  }, [filteredData]);

  // 大运变化点
  const daYunChanges = useMemo(() => {
    return filteredData.filter((d, i) => {
      if (i === 0) return true;
      const prevIndex = filteredData.findIndex(item => item.age === d.age - 1);
      if (prevIndex === -1) return true;
      return d.daYun !== filteredData[prevIndex].daYun;
    });
  }, [filteredData]);

  // 缩放控制 - 中心缩放：左右同时向中心靠拢
  // 设置最小范围限制为10，防止过度放大导致年龄出现小数
  const MIN_RANGE = 10;
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    const range = ageRange[1] - ageRange[0];
    let newRange = range;
    
    if (direction === 'in') {
      // 放大时，先计算新范围
      newRange = range - 10;
      
      // 计算当前中心点（取整）
      const center = Math.round((ageRange[0] + ageRange[1]) / 2);
      
      // 计算以中心为基准的新范围
      let testStart = center - newRange / 2;
      let testEnd = center + newRange / 2;
      
      // 检查是否会出现小数或范围太小
      const wouldHaveDecimal = 
        Math.floor(testStart) !== testStart || 
        Math.ceil(testEnd) !== testEnd ||
        newRange < MIN_RANGE;
      
      // 如果会出现小数或范围太小，使用当前范围（不放大）
      if (wouldHaveDecimal) {
        return; // 停止放大，保持当前状态
      }
      
      newRange = Math.max(MIN_RANGE, newRange);
      setZoomLevel(prev => Math.min(prev + 0.1, 3));
    } else if (direction === 'out') {
      newRange = Math.min(100, range + 10);
      setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    } else {
      newRange = 100;
      setZoomLevel(1);
    }
    
    // 计算当前中心点（取整）
    const center = Math.round((ageRange[0] + ageRange[1]) / 2);
    
    // 理想的起始和结束点（以中心为基准，确保为整数）
    let idealStart = Math.floor(center - newRange / 2);
    let idealEnd = Math.ceil(center + newRange / 2);
    
    // 确保范围至少为MIN_RANGE
    if (idealEnd - idealStart < MIN_RANGE) {
      const diff = MIN_RANGE - (idealEnd - idealStart);
      idealStart = Math.max(1, idealStart - Math.floor(diff / 2));
      idealEnd = Math.min(100, idealEnd + Math.ceil(diff / 2));
    }
    
    // 如果超出边界，需要调整中心点，但尽量保持中心缩放的效果
    if (idealStart < 1) {
      // 左边界超出，向右调整
      const offset = 1 - idealStart;
      idealStart = 1;
      idealEnd = Math.min(100, idealEnd + offset);
    } else if (idealEnd > 100) {
      // 右边界超出，向左调整
      const offset = idealEnd - 100;
      idealEnd = 100;
      idealStart = Math.max(1, idealStart - offset);
    }
    
    // 最终确保为整数
    setAgeRange([Math.floor(idealStart), Math.ceil(idealEnd)]);
  };

  // 跳转到指定年龄
  const handleJumpToAge = (age: number) => {
    if (age < 1 || age > 100) return;
    const range = ageRange[1] - ageRange[0];
    const newStart = Math.max(1, Math.min(100 - range, age - range / 2));
    const newEnd = Math.min(100, Math.max(1, newStart + range));
    setAgeRange([newStart, newEnd]);
    setSearchAge('');
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      chartRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoom('in');
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoom('out');
      } else if (e.key === '0') {
        e.preventDefault();
        handleZoom('reset');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [ageRange]);

  // 鼠标滚轮缩放 - 以鼠标位置为中心缩放
  const MIN_RANGE_WHEEL = 10; // 最小范围限制
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!chartRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      
      // 获取图表容器的位置和尺寸
      const container = chartRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      // 查找ResponsiveContainer或ComposedChart的实际绘制区域
      // 尝试查找SVG元素（Recharts会在ResponsiveContainer内创建SVG）
      const svgElement = container.querySelector('svg');
      if (!svgElement) return;
      
      const svgRect = svgElement.getBoundingClientRect();
      // 计算鼠标相对于SVG的X坐标
      const mouseX = e.clientX - svgRect.left;
      const svgWidth = svgRect.width;
      
      // 计算鼠标位置对应的年龄（线性插值）
      // 考虑X轴的domain和实际绘制区域
      const ageAtMouse = ageRange[0] + (mouseX / svgWidth) * (ageRange[1] - ageRange[0]);
      
      // 确定缩放方向
      const delta = e.deltaY > 0 ? 10 : -10;
      const range = ageRange[1] - ageRange[0];
      let newRange = range + delta;
      
      // 如果放大，检查是否会出现小数
      if (delta < 0) { // 放大
        // 计算以鼠标位置为中心的新范围
        let testStart = ageAtMouse - newRange / 2;
        let testEnd = ageAtMouse + newRange / 2;
        
        // 检查是否会出现小数：取整后如果与原始值不同，说明有小数
        const testStartInt = Math.floor(testStart);
        const testEndInt = Math.ceil(testEnd);
        const hasDecimal = (testStartInt !== testStart) || (testEndInt !== testEnd);
        const rangeTooSmall = (testEndInt - testStartInt) < MIN_RANGE_WHEEL;
        
        // 如果会出现小数或范围太小，使用当前范围（不放大）
        if (hasDecimal || rangeTooSmall || newRange < MIN_RANGE_WHEEL) {
          return; // 停止放大，保持当前状态
        }
      }
      
      // 限制范围
      newRange = Math.max(MIN_RANGE_WHEEL, Math.min(100, newRange));
      
      // 以鼠标位置为中心计算新的范围
      let idealStart = ageAtMouse - newRange / 2;
      let idealEnd = ageAtMouse + newRange / 2;
      
      // 确保为整数
      idealStart = Math.floor(idealStart);
      idealEnd = Math.ceil(idealEnd);
      
      // 确保范围至少为MIN_RANGE_WHEEL
      if (idealEnd - idealStart < MIN_RANGE_WHEEL) {
        const diff = MIN_RANGE_WHEEL - (idealEnd - idealStart);
        idealStart = Math.max(1, idealStart - Math.floor(diff / 2));
        idealEnd = Math.min(100, idealEnd + Math.ceil(diff / 2));
      }
      
      // 如果超出边界，需要调整
      if (idealStart < 1) {
        const offset = 1 - idealStart;
        idealStart = 1;
        idealEnd = Math.min(100, idealEnd + offset);
      } else if (idealEnd > 100) {
        const offset = idealEnd - 100;
        idealEnd = 100;
        idealStart = Math.max(1, idealStart - offset);
      }
      
      // 最终确保为整数
      setAgeRange([Math.floor(idealStart), Math.ceil(idealEnd)]);
    };

    const chartElement = chartRef.current;
    if (chartElement) {
      chartElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => chartElement.removeEventListener('wheel', handleWheel);
    }
  }, [ageRange]);

  // 触摸手势支持（双指捏合缩放）
  useEffect(() => {
    if (!isMobile) return;

    let initialDistance = 0;
    let initialRange = ageRange[1] - ageRange[0];

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialRange = ageRange[1] - ageRange[0];
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const MIN_RANGE_TOUCH = 10; // 最小范围限制
        const scale = initialDistance / currentDistance;
        const newRange = Math.max(MIN_RANGE_TOUCH, Math.min(100, initialRange * scale));
        
        // 计算当前中心点（取整）
        const center = Math.round((ageRange[0] + ageRange[1]) / 2);
        
        // 理想的起始和结束点（以中心为基准，确保为整数）
        let idealStart = Math.floor(center - newRange / 2);
        let idealEnd = Math.ceil(center + newRange / 2);
        
        // 确保范围至少为MIN_RANGE_TOUCH
        if (idealEnd - idealStart < MIN_RANGE_TOUCH) {
          const diff = MIN_RANGE_TOUCH - (idealEnd - idealStart);
          idealStart = Math.max(1, idealStart - Math.floor(diff / 2));
          idealEnd = Math.min(100, idealEnd + Math.ceil(diff / 2));
        }
        
        // 如果超出边界，需要调整中心点，但尽量保持中心缩放的效果
        if (idealStart < 1) {
          // 左边界超出，向右调整
          const offset = 1 - idealStart;
          idealStart = 1;
          idealEnd = Math.min(100, idealEnd + offset);
        } else if (idealEnd > 100) {
          // 右边界超出，向左调整
          const offset = idealEnd - 100;
          idealEnd = 100;
          idealStart = Math.max(1, idealStart - offset);
        }
        
        // 最终确保为整数
        setAgeRange([Math.floor(idealStart), Math.ceil(idealEnd)]);
      }
    };

    const handleTouchEnd = () => {
      initialDistance = 0;
    };

    const chartElement = chartRef.current;
    if (chartElement) {
      chartElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      chartElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      chartElement.addEventListener('touchend', handleTouchEnd);
      return () => {
        chartElement.removeEventListener('touchstart', handleTouchStart);
        chartElement.removeEventListener('touchmove', handleTouchMove);
        chartElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, ageRange]);

  if (!data || data.length === 0) {
    return <div className="h-[600px] flex items-center justify-center text-gray-400">无数据</div>;
  }

  return (
    <div ref={chartRef} className="w-full bg-white p-2 md:p-6 rounded-xl border border-gray-200 shadow-sm relative">
      {/* 工具栏 */}
      <div className="mb-4 space-y-3">
        {/* 标题行 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 font-serif-sc">
              {userName ? `${userName}的` : ''}人生流年大运K线图
            </h3>
            {userName && (
              <p className="text-xs text-gray-500 mt-1">命主：{userName}</p>
            )}
          </div>
          
          {/* 工具栏按钮组 */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 缩放控制 */}
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
              <button
                onClick={() => handleZoom('out')}
                className="p-1.5 md:p-1.5 hover:bg-gray-200 rounded transition-colors touch-manipulation"
                title="缩小 (快捷键: -)"
                aria-label="缩小"
              >
                <ZoomOut className="w-4 h-4 md:w-4 h-4 text-gray-600" />
              </button>
              <span className="text-xs md:text-xs text-gray-600 font-medium min-w-[3rem] text-center hidden sm:inline">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => handleZoom('in')}
                className="p-1.5 md:p-1.5 hover:bg-gray-200 rounded transition-colors touch-manipulation"
                title="放大 (快捷键: +)"
                aria-label="放大"
              >
                <ZoomIn className="w-4 h-4 md:w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleZoom('reset')}
                className="p-1.5 md:p-1.5 hover:bg-gray-200 rounded transition-colors ml-1 touch-manipulation"
                title="重置 (快捷键: 0)"
                aria-label="重置缩放"
              >
                <RotateCcw className="w-4 h-4 md:w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 搜索和跳转 */}
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
              <Search className="w-4 h-4 text-gray-400 hidden sm:block" />
              <input
                type="number"
                placeholder="跳转年龄..."
                value={searchAge}
                onChange={(e) => setSearchAge(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchAge) {
                    handleJumpToAge(parseInt(searchAge));
                  }
                }}
                min="1"
                max="100"
                className="w-16 md:w-20 px-2 py-1.5 md:py-1 text-xs md:text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
              <button
                onClick={() => {
                  if (searchAge) {
                    handleJumpToAge(parseInt(searchAge));
                  }
                }}
                className="px-2 md:px-2 py-1.5 md:py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors touch-manipulation"
                disabled={!searchAge}
              >
                跳转
              </button>
            </div>

            {/* 全屏按钮 */}
            <button
              onClick={toggleFullscreen}
              className="p-2 md:p-2 bg-gray-50 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors touch-manipulation"
              title="全屏 (快捷键: F)"
              aria-label="切换全屏"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 md:w-4 h-4 text-gray-600" />
              ) : (
                <Maximize2 className="w-4 h-4 md:w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* 显示选项 */}
            <button
              onClick={() => setShowKeyYears(!showKeyYears)}
              className={`px-3 md:px-3 py-1.5 md:py-1.5 text-xs rounded-lg transition-colors touch-manipulation ${
                showKeyYears
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Award className="w-4 h-4 inline mr-1" />
              <span className="hidden sm:inline">关键年份</span>
              <span className="sm:hidden">关键</span>
            </button>
          </div>
        </div>

        {/* 时间范围选择 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-xs text-gray-600 font-medium hidden sm:inline">年龄范围:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={ageRange[0]}
              onChange={(e) => setAgeRange([parseInt(e.target.value) || 1, ageRange[1]])}
              className="flex-1 sm:w-16 px-2 py-1.5 md:py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
            />
            <span className="text-xs text-gray-400">-</span>
            <input
              type="number"
              min="1"
              max="100"
              value={ageRange[1]}
              onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value) || 100])}
              className="flex-1 sm:w-16 px-2 py-1.5 md:py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
            />
            <button
              onClick={() => setAgeRange([1, 100])}
              className="p-1.5 md:p-1 hover:bg-gray-200 rounded transition-colors touch-manipulation"
              title="重置范围"
              aria-label="重置范围"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* 当前查看范围显示 */}
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 w-full sm:w-auto">
            查看范围：<span className="font-semibold text-gray-700">{ageRange[0]}</span> - <span className="font-semibold text-gray-700">{ageRange[1]}</span> 岁
            <span className="text-gray-400 ml-1">({ageRange[1] - ageRange[0] + 1} 年)</span>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="mb-4 flex gap-4 text-xs font-medium px-2 flex-wrap">
        <span className="flex items-center text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
          <div className="w-2.5 h-2.5 bg-emerald-500 mr-2 rounded-sm"></div> 上涨 (Bullish)
        </span>
        <span className="flex items-center text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
          <div className="w-2.5 h-2.5 bg-rose-500 mr-2 rounded-sm"></div> 下跌 (Bearish)
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={isMobile ? 400 : 600}>
        <ComposedChart 
          data={chartData} 
          margin={{ top: 20, right: 15, left: 5, bottom: 60 }}
          barCategoryGap="15%"
        >
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
          
          <Tooltip content={<CustomTooltip userName={userName} />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
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
              {keyYears.top
                .filter(item => item.age >= ageRange[0] && item.age <= ageRange[1])
                .map((item) => (
                  <ReferenceLine
                    key={`high-${item.age}-${item.year}`}
                    x={item.age}
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    strokeWidth={2.5}
                    strokeOpacity={0.8}
                  >
                    <Label
                      value={`${item.year}年 (${item.score.toFixed(0)}分)`}
                      position="top"
                      fill="#10b981"
                      fontSize={10}
                      fontWeight="bold"
                      offset={5}
                    />
                  </ReferenceLine>
                ))}
              {keyYears.bottom
                .filter(item => item.age >= ageRange[0] && item.age <= ageRange[1])
                .map((item) => (
                  <ReferenceLine
                    key={`low-${item.age}-${item.year}`}
                    x={item.age}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2.5}
                    strokeOpacity={0.8}
                  >
                    <Label
                      value={`${item.year}年 (${item.score.toFixed(0)}分)`}
                      position="bottom"
                      fill="#ef4444"
                      fontSize={10}
                      fontWeight="bold"
                      offset={5}
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
            barSize={undefined}
            maxBarSize={80}
          />

          {/* 时间范围选择器 - 使用完整数据以确保Brush正确响应中心缩放 */}
          <Brush
            dataKey="age"
            height={30}
            stroke="#6366f1"
            data={fullChartData}
            startIndex={Math.max(0, fullChartData.findIndex((d: KLinePoint) => d.age >= ageRange[0]) || 0)}
            endIndex={(() => {
              // 从后往前查找最后一个满足条件的索引
              for (let i = fullChartData.length - 1; i >= 0; i--) {
                if (fullChartData[i].age <= ageRange[1]) {
                  return i;
                }
              }
              return fullChartData.length - 1;
            })()}
            onChange={(brushData: any) => {
              if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
                const startAge = fullChartData[brushData.startIndex]?.age || ageRange[0];
                const endAge = fullChartData[brushData.endIndex]?.age || ageRange[1];
                // 确保年龄为整数
                setAgeRange([Math.floor(startAge), Math.ceil(endAge)]);
              }
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 提示 */}
      <div className="mt-2 text-xs text-gray-500 px-2 space-y-1">
        <div className="flex flex-col sm:flex-row gap-2">
          <span>💡 提示：使用鼠标滚轮可以缩放图表，拖动底部滑块可以快速选择时间范围</span>
          <span className="hidden sm:inline text-gray-400">|</span>
          <span className="text-gray-400">
            快捷键：<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">+</kbd>/<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">-</kbd> 缩放，
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">0</kbd> 重置，
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">F</kbd> 全屏
          </span>
        </div>
        {isMobile && (
          <div className="text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            📱 移动端提示：横屏查看效果更佳，双指捏合可缩放
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedKLineChart;
