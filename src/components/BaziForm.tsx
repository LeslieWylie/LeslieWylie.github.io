import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaziInput, Gender, PromptType } from '../types';
import { baziInputSchema, BaziInputFormData } from '../utils/validation';
import { Sparkles, TrendingUp, FileCode, Settings, AlertCircle, Copy, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface BaziFormProps {
  onGeneratePrompt: (data: BaziInput) => void;
}

const BaziForm: React.FC<BaziFormProps> = ({ onGeneratePrompt }) => {
  const [showBatchInput, setShowBatchInput] = useState(false);
  const [batchText, setBatchText] = useState('');
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BaziInputFormData>({
    resolver: zodResolver(baziInputSchema),
    defaultValues: {
      name: '',
      gender: Gender.MALE,
      birthYear: '',
      yearPillar: '',
      monthPillar: '',
      dayPillar: '',
      hourPillar: '',
      startAge: '',
      firstDaYun: '',
      promptType: 'default',
      customPrompt: '',
    },
  });

  const watchedYearPillar = watch('yearPillar');
  const watchedGender = watch('gender');
  const watchedPromptType = watch('promptType');

  // Calculate direction for UI feedback
  const daYunDirectionInfo = useMemo(() => {
    if (!watchedYearPillar) return '等待输入年柱...';
    
    const firstChar = watchedYearPillar.trim().charAt(0);
    const yinStems = ['乙', '丁', '己', '辛', '癸'];
    
    let isYangYear = true;
    if (yinStems.includes(firstChar)) isYangYear = false;
    
    let isForward = false;
    if (watchedGender === Gender.MALE) {
      isForward = isYangYear;
    } else {
      isForward = !isYangYear;
    }
    
    return isForward ? '顺行 (阳男/阴女)' : '逆行 (阴男/阳女)';
  }, [watchedYearPillar, watchedGender]);

  const onSubmit = (data: BaziInputFormData) => {
    const baziInput: BaziInput = {
      name: data.name,
      gender: data.gender === 'Male' ? Gender.MALE : Gender.FEMALE,
      birthYear: data.birthYear,
      yearPillar: data.yearPillar,
      monthPillar: data.monthPillar,
      dayPillar: data.dayPillar,
      hourPillar: data.hourPillar,
      startAge: data.startAge,
      firstDaYun: data.firstDaYun,
      promptType: data.promptType as PromptType,
      customPrompt: data.customPrompt,
    };
    onGeneratePrompt(baziInput);
  };

  // 批量输入解析函数
  const parseBatchInput = (text: string): { yearPillar?: string; monthPillar?: string; dayPillar?: string; hourPillar?: string } | null => {
    if (!text || !text.trim()) return null;

    const cleaned = text.trim();
    
    // 模式1: 完整格式 "年柱：甲子 月柱：乙丑 日柱：丙寅 时柱：丁卯"
    const fullPattern = /年柱[：:]\s*(\S+).*?月柱[：:]\s*(\S+).*?日柱[：:]\s*(\S+).*?时柱[：:]\s*(\S+)/;
    let match = cleaned.match(fullPattern);
    if (match) {
      return {
        yearPillar: match[1],
        monthPillar: match[2],
        dayPillar: match[3],
        hourPillar: match[4],
      };
    }

    // 模式2: 简化格式 "年：甲子 月：乙丑 日：丙寅 时：丁卯"
    const simplePattern = /年[：:]\s*(\S+).*?月[：:]\s*(\S+).*?日[：:]\s*(\S+).*?时[：:]\s*(\S+)/;
    match = cleaned.match(simplePattern);
    if (match) {
      return {
        yearPillar: match[1],
        monthPillar: match[2],
        dayPillar: match[3],
        hourPillar: match[4],
      };
    }

    // 模式3: 空格或逗号分隔 "甲子 乙丑 丙寅 丁卯" 或 "甲子,乙丑,丙寅,丁卯"
    const items = cleaned.split(/[\s,，、]+/).filter(item => item.trim().length > 0);
    if (items.length >= 4) {
      return {
        yearPillar: items[0],
        monthPillar: items[1],
        dayPillar: items[2],
        hourPillar: items[3],
      };
    }

    // 模式4: 换行分隔（每行一个柱）
    const lines = cleaned.split(/[\n\r]+/).filter(line => line.trim().length > 0);
    if (lines.length >= 4) {
      return {
        yearPillar: lines[0].trim(),
        monthPillar: lines[1].trim(),
        dayPillar: lines[2].trim(),
        hourPillar: lines[3].trim(),
      };
    }

    return null;
  };

  const handleBatchInput = () => {
    const parsed = parseBatchInput(batchText);
    if (parsed) {
      if (parsed.yearPillar) setValue('yearPillar', parsed.yearPillar);
      if (parsed.monthPillar) setValue('monthPillar', parsed.monthPillar);
      if (parsed.dayPillar) setValue('dayPillar', parsed.dayPillar);
      if (parsed.hourPillar) setValue('hourPillar', parsed.hourPillar);
      toast.success('已自动填充四柱信息');
      setBatchText('');
      setShowBatchInput(false);
    } else {
      toast.error('无法解析，请检查格式。支持格式：空格分隔、完整格式、换行分隔');
    }
  };

  const ErrorMessage = ({ field }: { field: keyof BaziInputFormData }) => {
    const error = errors[field];
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>{error.message as string}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-serif-sc font-bold text-gray-800 mb-2">八字排盘</h2>
        <p className="text-gray-500 text-sm">请输入四柱与大运信息以生成 Gemini Prompt</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Name & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 (可选)</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base md:text-sm"
              placeholder="姓名"
              style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
            />
            <ErrorMessage field="name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setValue('gender', 'Male' as any)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                  watchedGender === Gender.MALE
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                乾造 (男)
              </button>
              <button
                type="button"
                onClick={() => setValue('gender', 'Female' as any)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                  watchedGender === Gender.FEMALE
                    ? 'bg-white text-pink-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                坤造 (女)
              </button>
            </div>
            <ErrorMessage field="gender" />
          </div>
        </div>

        {/* 批量输入面板 */}
        <div className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowBatchInput(!showBatchInput)}
            className="w-full flex items-center justify-between p-4 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <Copy className="w-4 h-4" />
              <span>批量输入四柱（可选）</span>
            </div>
            {showBatchInput ? (
              <ChevronUp className="w-5 h-5 text-green-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-green-600" />
            )}
          </button>
          
          {showBatchInput && (
            <div className="p-4 border-t border-green-200 space-y-3">
              <textarea
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder={`支持多种格式：
1. 空格分隔：甲子 乙丑 丙寅 丁卯
2. 完整格式：年柱：甲子 月柱：乙丑 日柱：丙寅 时柱：丁卯
3. 简化格式：年：甲子 月：乙丑 日：丙寅 时：丁卯
4. 换行分隔：每行一个柱`}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-sm font-mono resize-none"
                rows={6}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBatchInput}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  解析并填充
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBatchText('');
                    setShowBatchInput(false);
                  }}
                  className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  取消
                </button>
              </div>
              <p className="text-xs text-green-700">
                💡 提示：解析成功后会自动填充到下方表单，您仍可以手动修改
              </p>
            </div>
          )}
        </div>

        {/* Four Pillars Manual Input */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 mb-3 text-amber-800 text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            <span>输入四柱干支 (必填)</span>
          </div>
          
          {/* Birth Year Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">出生年份 (阳历)</label>
              <input
                type="number"
                {...register('birthYear')}
                min="1900"
                max="2100"
                placeholder="如: 1990"
                className={`w-full px-3 py-2.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white font-bold text-base md:text-sm ${
                  errors.birthYear ? 'border-red-300' : 'border-amber-200'
                }`}
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
            <ErrorMessage field="birthYear" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">年柱 (Year)</label>
              <input
                type="text"
                {...register('yearPillar')}
                placeholder="如: 甲子"
                className={`w-full px-3 py-2.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold text-base md:text-sm ${
                  errors.yearPillar ? 'border-red-300' : 'border-amber-200'
                }`}
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
              <ErrorMessage field="yearPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">月柱 (Month)</label>
              <input
                type="text"
                {...register('monthPillar')}
                placeholder="如: 丙寅"
                className={`w-full px-3 py-2.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold text-base md:text-sm ${
                  errors.monthPillar ? 'border-red-300' : 'border-amber-200'
                }`}
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
              <ErrorMessage field="monthPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">日柱 (Day)</label>
              <input
                type="text"
                {...register('dayPillar')}
                placeholder="如: 戊辰"
                className={`w-full px-3 py-2.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold text-base md:text-sm ${
                  errors.dayPillar ? 'border-red-300' : 'border-amber-200'
                }`}
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
              <ErrorMessage field="dayPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">时柱 (Hour)</label>
              <input
                type="text"
                {...register('hourPillar')}
                placeholder="如: 壬戌"
                className={`w-full px-3 py-2.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold text-base md:text-sm ${
                  errors.hourPillar ? 'border-red-300' : 'border-amber-200'
                }`}
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
              <ErrorMessage field="hourPillar" />
            </div>
          </div>
        </div>

        {/* Da Yun Manual Input */}
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-3 text-indigo-800 text-sm font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>大运排盘信息 (必填)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">起运年龄 (虚岁)</label>
              <input
                type="number"
                {...register('startAge')}
                min="1"
                max="100"
                placeholder="如: 3"
                className={`w-full px-3 py-2.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-bold text-base md:text-sm ${
                  errors.startAge ? 'border-red-300' : 'border-indigo-200'
                }`}
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
              <ErrorMessage field="startAge" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">第一步大运</label>
              <input
                type="text"
                {...register('firstDaYun')}
                placeholder="如: 丁卯"
                className={`w-full px-3 py-2.5 md:py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-serif-sc font-bold text-base md:text-sm ${
                  errors.firstDaYun ? 'border-red-300' : 'border-indigo-200'
                }`}
                style={{ fontSize: '16px' }} // 防止 iOS 自动缩放
              />
              <ErrorMessage field="firstDaYun" />
            </div>
          </div>
          <p className="text-xs text-indigo-600/70 mt-2 text-center">
            当前大运排序规则：
            <span className="font-bold text-indigo-900">{daYunDirectionInfo}</span>
          </p>
        </div>

        {/* Prompt 类型选择 */}
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-3 text-purple-800 text-sm font-bold">
            <Settings className="w-4 h-4" />
            <span>Prompt 类型选择</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">选择 Prompt 类型</label>
              <select
                {...register('promptType')}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white text-sm"
              >
                <option value="default">默认 Prompt（标准版）</option>
                <option value="detailed">详细 Prompt（深入分析）</option>
                <option value="detailed_v2">详细 Prompt V2（全息数据版）⭐</option>
                <option value="detailed_v3">详细 Prompt V3（精准逻辑版）⭐</option>
                <option value="custom">自定义 Prompt</option>
              </select>
              <ErrorMessage field="promptType" />
            </div>
            
            {watchedPromptType === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">自定义系统 Prompt</label>
                <textarea
                  {...register('customPrompt')}
                  rows={8}
                  placeholder="请输入自定义的系统角色设定 Prompt..."
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white text-sm font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示：自定义 Prompt 将作为系统角色设定发送给 Gemini
                </p>
                <ErrorMessage field="customPrompt" />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 md:py-3.5 rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
          style={{ minHeight: '44px' }} // 移动端触摸目标至少 44px
        >
          <FileCode className="h-5 w-5" />
          <span>{isSubmitting ? '生成中...' : '生成 Gemini Prompt'}</span>
        </button>
      </form>
    </div>
  );
};

export default BaziForm;
