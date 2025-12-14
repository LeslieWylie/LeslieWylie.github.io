import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { LifeDestinyResult } from '../types';
import { validateLifeDestinyResult, getValidationErrors } from '../utils/validation';

interface FileUploadProps {
  onUpload: (data: LifeDestinyResult) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  // 转换 Gemini 返回的格式为项目所需格式
  const convertGeminiResult = (raw: any): LifeDestinyResult => {
    // 确保 bazi 是数组
    let baziArray: string[] = [];
    if (Array.isArray(raw.bazi)) {
      baziArray = raw.bazi;
    } else if (raw.bazi && typeof raw.bazi === 'object') {
      // 如果是对象，尝试转换为数组
      baziArray = Object.values(raw.bazi).filter(v => typeof v === 'string') as string[];
    }
    
    const cleanedBazi = cleanBazi(baziArray);
    
    // 确保至少有4个元素
    while (cleanedBazi.length < 4) {
      cleanedBazi.push('');
    }

    // 获取 chartData
    const chartData = Array.isArray(raw.chartPoints) 
      ? raw.chartPoints 
      : Array.isArray(raw.chartData) 
        ? raw.chartData 
        : [];

    return {
      chartData: chartData,
      analysis: {
        bazi: cleanedBazi.slice(0, 4), // 确保只有4个元素
        summary: String(raw.summary || "无摘要"),
        summaryScore: typeof raw.summaryScore === 'number' ? raw.summaryScore : 5,
        industry: String(raw.industry || "无"),
        industryScore: typeof raw.industryScore === 'number' ? raw.industryScore : 5,
        wealth: String(raw.wealth || "无"),
        wealthScore: typeof raw.wealthScore === 'number' ? raw.wealthScore : 5,
        marriage: String(raw.marriage || "无"),
        marriageScore: typeof raw.marriageScore === 'number' ? raw.marriageScore : 5,
        health: String(raw.health || "无"),
        healthScore: typeof raw.healthScore === 'number' ? raw.healthScore : 5,
        family: String(raw.family || "无"),
        familyScore: typeof raw.familyScore === 'number' ? raw.familyScore : 5,
      },
    };
  };

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);
    setValidationDetails([]);

    if (!file.name.endsWith('.json')) {
      setError('请上传 JSON 格式的文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rawData = JSON.parse(text);

        // 验证数据格式
        if (!rawData.chartPoints && !rawData.chartData) {
          setError('JSON 文件格式不正确：缺少 chartPoints 或 chartData 字段');
          return;
        }

        // 转换数据格式
        const convertedData = convertGeminiResult(rawData);

        // 使用 zod 进行严格验证
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
          setError('JSON 文件中没有有效的 K 线数据');
          return;
        }

        if (convertedData.chartData.length !== 100) {
          setError(`警告：数据点数量为 ${convertedData.chartData.length}，期望 100 个。将继续加载...`);
        }

        setSuccess(true);
        setTimeout(() => {
          onUpload(convertedData);
          setSuccess(false);
        }, 500);
      } catch (err) {
        setError(`JSON 解析失败：${err instanceof Error ? err.message : '未知错误'}`);
      }
    };

    reader.onerror = () => {
      setError('文件读取失败');
    };

    reader.readAsText(file);
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
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
            <FileText className="w-4 h-4" />
            <span>支持 .json 格式</span>
          </div>
        </div>
      </div>

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
