import React, { useState } from 'react';
import { UserInput, Gender } from '../types';
import { Loader2, Sparkles } from 'lucide-react';

interface BaziFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const BaziForm: React.FC<BaziFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gender: Gender.MALE,
    birthDate: '',
    birthTime: '12:00',
    birthPlace: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif-sc font-bold text-gray-800 mb-2">排盘信息</h2>
        <p className="text-gray-500 text-sm">请输入出生信息以生成人生K线</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名 (可选)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="请输入姓名"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: Gender.MALE })}
              className={`py-2 rounded-lg border text-sm font-medium transition ${
                formData.gender === Gender.MALE
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              男 (乾造)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: Gender.FEMALE })}
              className={`py-2 rounded-lg border text-sm font-medium transition ${
                formData.gender === Gender.FEMALE
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              女 (坤造)
            </button>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">出生日期 (公历)</label>
            <input
              type="date"
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">出生时间</label>
            <input
              type="time"
              name="birthTime"
              required
              value={formData.birthTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Place */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">出生地点</label>
          <input
            type="text"
            name="birthPlace"
            required
            value={formData.birthPlace}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="例如：北京市朝阳区"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>正在排盘分析...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>生成人生K线</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BaziForm;
