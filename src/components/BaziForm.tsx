import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaziInput, Gender, PromptType } from '../types';
import { baziInputSchema, BaziInputFormData } from '../utils/validation';
import { Sparkles, TrendingUp, FileCode, Settings, AlertCircle } from 'lucide-react';

interface BaziFormProps {
  onGeneratePrompt: (data: BaziInput) => void;
}

const BaziForm: React.FC<BaziFormProps> = ({ onGeneratePrompt }) => {
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
      gender: data.gender,
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="姓名"
            />
            <ErrorMessage field="name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setValue('gender', Gender.MALE)}
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
                onClick={() => setValue('gender', Gender.FEMALE)}
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white font-bold ${
                errors.birthYear ? 'border-red-300' : 'border-amber-200'
              }`}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold ${
                  errors.yearPillar ? 'border-red-300' : 'border-amber-200'
                }`}
              />
              <ErrorMessage field="yearPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">月柱 (Month)</label>
              <input
                type="text"
                {...register('monthPillar')}
                placeholder="如: 丙寅"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold ${
                  errors.monthPillar ? 'border-red-300' : 'border-amber-200'
                }`}
              />
              <ErrorMessage field="monthPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">日柱 (Day)</label>
              <input
                type="text"
                {...register('dayPillar')}
                placeholder="如: 戊辰"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold ${
                  errors.dayPillar ? 'border-red-300' : 'border-amber-200'
                }`}
              />
              <ErrorMessage field="dayPillar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">时柱 (Hour)</label>
              <input
                type="text"
                {...register('hourPillar')}
                placeholder="如: 壬戌"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-center font-serif-sc font-bold ${
                  errors.hourPillar ? 'border-red-300' : 'border-amber-200'
                }`}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-bold ${
                  errors.startAge ? 'border-red-300' : 'border-indigo-200'
                }`}
              />
              <ErrorMessage field="startAge" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">第一步大运</label>
              <input
                type="text"
                {...register('firstDaYun')}
                placeholder="如: 丁卯"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-center font-serif-sc font-bold ${
                  errors.firstDaYun ? 'border-red-300' : 'border-indigo-200'
                }`}
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
                <option value="simple">简化 Prompt（快速版）</option>
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
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <FileCode className="h-5 w-5" />
          <span>{isSubmitting ? '生成中...' : '生成 Gemini Prompt'}</span>
        </button>
      </form>
    </div>
  );
};

export default BaziForm;
