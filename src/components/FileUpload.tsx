import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Type, FileUp } from 'lucide-react';
import { LifeDestinyResult, KLinePoint, TimelinePoint } from '../types';
import { validateLifeDestinyResult, getValidationErrors } from '../utils/validation';

interface FileUploadProps {
  onUpload: (data: LifeDestinyResult) => void;
}

type UploadMode = 'file' | 'text';

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationDetails, setValidationDetails] = useState<string[]>([]);

  // 清理 bazi 数组中的标注
  const cleanBazi = (bazi: string[] | undefined): string[] => {
    if (!Array.isArray(bazi)) {
      return [];
    }
    return bazi.map(pillar => {
      if (typeof pillar !== 'string') {
        return String(pillar || '').replace(/\s*\([^)]*\)\s*/g, '').trim();
      }
      return pillar.replace(/\s*\([^)]*\)\s*/g, '').trim();
    }).filter(p => p.length > 0);
  };

  // 标准化分数到 0-10 范围
  const normalizeScore = (score: number | undefined | null): number => {
    if (typeof score !== 'number' || isNaN(score)) {
      return 5; // 默认值
    }
    // 如果分数大于 10，假设是 0-100 范围，需要除以 10
    if (score > 10) {
      return Math.max(0, Math.min(10, score / 10));
    }
    // 如果分数在 0-10 范围内，直接返回，但确保在有效范围内
    return Math.max(0, Math.min(10, score));
  };

  // 从 V2 格式的 timeline 转换为 KLinePoint
  const convertTimelineToKLinePoints = (timeline: TimelinePoint[]): KLinePoint[] => {
    return timeline.map((point) => ({
      age: point.age,
      year: point.year,
      ganZhi: point.metaphysics.ganZhi,
      daYun: point.metaphysics.daYun,
      open: point.kLine.open,
      close: point.kLine.close,
      high: point.kLine.high,
      low: point.kLine.low,
      score: point.kLine.close, // 使用收盘价作为分数
      reason: (point.forecast.content && point.forecast.content.trim()) || point.forecast.title || `流年${point.metaphysics.ganZhi}`,
      // V2 格式的扩展字段
      trend: point.kLine.trend,
      tenGod: point.metaphysics.tenGod,
      interaction: point.metaphysics.interaction,
      shenSha: point.metaphysics.shenSha,
      energy: point.metaphysics.energy,
      title: point.forecast.title,
      tags: point.forecast.tags,
      advice: point.forecast.advice,
      luckyColor: point.forecast.luckyColor,
      luckyDirection: point.forecast.luckyDirection,
    }));
  };

  // 从 V2 格式的 baseChart 提取 bazi
  const extractBaziFromBaseChart = (baseChart: any): string[] => {
    if (!baseChart || !baseChart.pillars) {
      return [];
    }
    const pillars = baseChart.pillars;
    return [
      pillars.year?.ganZhi || '',
      pillars.month?.ganZhi || '',
      pillars.day?.ganZhi || '',
      pillars.hour?.ganZhi || '',
    ].filter(p => p.length > 0);
  };

  // 从 V2 格式的 globalDimensions 转换为 AnalysisData
  const convertGlobalDimensionsToAnalysis = (globalDimensions: any, baseChart?: any): any => {
    const bazi = baseChart ? extractBaziFromBaseChart(baseChart) : [];
    
    return {
      bazi: bazi.length === 4 ? bazi : ['', '', '', ''],
      summary: globalDimensions?.summary || "无摘要",
      summaryScore: normalizeScore(globalDimensions?.scores?.total),
      industry: "事业分析", // V2 格式中没有单独的 industry 字段
      industryScore: normalizeScore(globalDimensions?.scores?.career),
      wealth: "财富分析",
      wealthScore: normalizeScore(globalDimensions?.scores?.wealth),
      marriage: "婚姻分析",
      marriageScore: normalizeScore(globalDimensions?.scores?.marriage),
      health: "健康分析",
      healthScore: normalizeScore(globalDimensions?.scores?.health),
      family: "六亲分析",
      familyScore: normalizeScore(globalDimensions?.scores?.children),
    };
  };

  // 转换 Gemini 返回的格式为项目所需格式（支持 V1、V2 和 V3）
  const convertGeminiResult = (raw: any): LifeDestinyResult => {
    // 检查是否是 V2 格式（有 timeline 字段）
    if (raw.timeline && Array.isArray(raw.timeline)) {
      // V2 格式
      const chartData = convertTimelineToKLinePoints(raw.timeline);
      const analysis = convertGlobalDimensionsToAnalysis(raw.globalDimensions, raw.baseChart);
      
      return {
        chartData,
        analysis,
        v2Data: {
          meta: raw.meta,
          baseChart: raw.baseChart,
          globalDimensions: raw.globalDimensions,
          timeline: raw.timeline,
        },
      };
    }
    
    // 检查是否是 V3 格式（有 profile 和 summary.dimensions 字段）
    if (raw.profile && raw.summary && raw.summary.dimensions) {
      // V3 格式
      const baziArray = Array.isArray(raw.profile.bazi) ? raw.profile.bazi : [];
      const cleanedBazi = cleanBazi(baziArray);
      while (cleanedBazi.length < 4) {
        cleanedBazi.push('');
      }

      const chartData = Array.isArray(raw.chartPoints) ? raw.chartPoints : [];

      return {
        chartData: chartData,
        analysis: {
          bazi: cleanedBazi.slice(0, 4),
          summary: String(raw.summary.content || raw.summary || "无摘要"),
          summaryScore: normalizeScore(raw.summary.score),
          industry: String(raw.summary.dimensions.industry?.content || raw.summary.dimensions.industry || "无"),
          industryScore: normalizeScore(
            raw.summary.dimensions.industry?.score ?? 
            (typeof raw.summary.dimensions.industry === 'number' ? raw.summary.dimensions.industry : undefined)
          ),
          wealth: String(raw.summary.dimensions.wealth?.content || raw.summary.dimensions.wealth || "无"),
          wealthScore: normalizeScore(
            raw.summary.dimensions.wealth?.score ?? 
            (typeof raw.summary.dimensions.wealth === 'number' ? raw.summary.dimensions.wealth : undefined)
          ),
          marriage: String(raw.summary.dimensions.marriage?.content || raw.summary.dimensions.marriage || "无"),
          marriageScore: normalizeScore(
            raw.summary.dimensions.marriage?.score ?? 
            (typeof raw.summary.dimensions.marriage === 'number' ? raw.summary.dimensions.marriage : undefined)
          ),
          health: String(raw.summary.dimensions.health?.content || raw.summary.dimensions.health || "无"),
          healthScore: normalizeScore(
            raw.summary.dimensions.health?.score ?? 
            (typeof raw.summary.dimensions.health === 'number' ? raw.summary.dimensions.health : undefined)
          ),
          family: String(raw.summary.dimensions.family?.content || raw.summary.dimensions.family || "无"),
          familyScore: normalizeScore(
            raw.summary.dimensions.family?.score ?? 
            (typeof raw.summary.dimensions.family === 'number' ? raw.summary.dimensions.family : undefined)
          ),
        },
      };
    }
    
    // V1 格式（旧格式，向后兼容）
    let baziArray: string[] = [];
    if (Array.isArray(raw.bazi)) {
      baziArray = raw.bazi;
    } else if (raw.bazi && typeof raw.bazi === 'object') {
      baziArray = Object.values(raw.bazi).filter(v => typeof v === 'string') as string[];
    }
    
    const cleanedBazi = cleanBazi(baziArray);
    while (cleanedBazi.length < 4) {
      cleanedBazi.push('');
    }

    const chartData = Array.isArray(raw.chartPoints) 
      ? raw.chartPoints 
      : Array.isArray(raw.chartData) 
        ? raw.chartData 
        : [];

    return {
      chartData: chartData,
      analysis: {
        bazi: cleanedBazi.slice(0, 4),
        summary: String(raw.summary || "无摘要"),
        summaryScore: normalizeScore(raw.summaryScore),
        industry: String(raw.industry || "无"),
        industryScore: normalizeScore(raw.industryScore),
        wealth: String(raw.wealth || "无"),
        wealthScore: normalizeScore(raw.wealthScore),
        marriage: String(raw.marriage || "无"),
        marriageScore: normalizeScore(raw.marriageScore),
        health: String(raw.health || "无"),
        healthScore: normalizeScore(raw.healthScore),
        family: String(raw.family || "无"),
        familyScore: normalizeScore(raw.familyScore),
      },
    };
  };

  // 处理 JSON 数据（文件或文本）
  const processJsonData = (text: string) => {
    setError(null);
    setSuccess(false);
    setValidationDetails([]);

    if (!text || !text.trim()) {
      setError('请输入或上传 JSON 数据');
      return;
    }

    try {
      const rawData = JSON.parse(text);

      // 验证数据格式（支持 V1、V2 和 V3）
      const isV2Format = rawData.timeline && Array.isArray(rawData.timeline);
      const isV3Format = rawData.profile && rawData.summary && rawData.summary.dimensions;
      const isV1Format = (rawData.chartPoints || rawData.chartData) && Array.isArray(rawData.chartPoints || rawData.chartData);
      
      if (!isV2Format && !isV3Format && !isV1Format) {
        setError('JSON 格式不正确：缺少 timeline、profile/summary.dimensions、chartPoints 或 chartData 字段');
        return;
      }

      // 转换数据格式
      const convertedData = convertGeminiResult(rawData);

      // 使用 zod 进行严格验证（只验证 chartData）
      const validationResult = validateLifeDestinyResult(convertedData);

      if (!validationResult.success) {
        // 安全地获取验证错误
        const errors = validationResult.error 
          ? getValidationErrors(validationResult.error)
          : { general: '数据验证失败，请检查数据格式' };
        
        const errorMessages = Object.entries(errors).map(
          ([path, message]) => `${path}: ${message}`
        );
        
        setValidationDetails(errorMessages);
        setError(`数据验证失败，发现 ${errorMessages.length} 个问题。请查看详细信息。`);
        return;
      }

      // 验证数据完整性
      if (!convertedData.chartData || convertedData.chartData.length === 0) {
        setError('JSON 数据中没有有效的 K 线数据');
        return;
      }

      if (convertedData.chartData.length !== 100) {
        setError(`警告：数据点数量为 ${convertedData.chartData.length}，期望 100 个。将继续加载...`);
      }

      setSuccess(true);
      setTimeout(() => {
        onUpload(convertedData);
        setSuccess(false);
        // 清空文本输入
        if (uploadMode === 'text') {
          setJsonText('');
        }
      }, 500);
    } catch (err) {
      setError(`JSON 解析失败：${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('请上传 JSON 格式的文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processJsonData(text);
    };

    reader.onerror = () => {
      setError('文件读取失败');
    };

    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    processJsonData(jsonText);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-md">
      {/* 模式切换标签 */}
      <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => {
            setUploadMode('file');
            setError(null);
            setJsonText('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            uploadMode === 'file'
              ? 'bg-white text-indigo-600 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>上传文件</span>
        </button>
        <button
          onClick={() => {
            setUploadMode('text');
            setError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            uploadMode === 'text'
              ? 'bg-white text-indigo-600 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>在线输入</span>
        </button>
      </div>

      {/* 文件上传模式 */}
      {uploadMode === 'file' && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-gray-600'}`} />
            </div>

            <div>
              <p className="text-lg font-bold text-gray-700 mb-1">
                {isDragging ? '松开以上传文件' : '上传 JSON 结果文件'}
              </p>
              <p className="text-sm text-gray-500">
                拖拽文件到此处，或{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                >
                  点击选择文件
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                支持 V1、V2 和 V3 格式
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
              <FileText className="w-4 h-4" />
              <span>支持 .json 格式</span>
            </div>
          </div>
        </div>
      )}

      {/* 在线输入模式 */}
      {uploadMode === 'text' && (
        <div className="border-2 border-gray-300 rounded-xl p-4 bg-white">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              直接粘贴 JSON 数据
            </label>
            <textarea
              ref={textAreaRef}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="请将 Gemini 返回的 JSON 数据粘贴到这里..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-xs resize-none"
              spellCheck={false}
            />
            <p className="text-xs text-gray-400 mt-2">
              支持 V1、V2 和 V3 格式，支持格式化或压缩的 JSON
            </p>
          </div>
          <button
            onClick={handleTextSubmit}
            disabled={!jsonText.trim()}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            解析并加载数据
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{error}</p>
          </div>
          {validationDetails.length > 0 && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
              <p className="text-xs font-bold text-red-800 mb-2">验证详情：</p>
              <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                {validationDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-100">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">文件上传成功，正在加载数据...</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
