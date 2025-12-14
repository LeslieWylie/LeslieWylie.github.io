import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

interface PromptDisplayProps {
  systemPrompt: string;
  userPrompt: string;
  onClose: () => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ systemPrompt, userPrompt, onClose }) => {
  const [copiedSystem, setCopiedSystem] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);

  const copyToClipboard = (text: string, type: 'system' | 'user') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'system') {
        setCopiedSystem(true);
        setTimeout(() => setCopiedSystem(false), 2000);
      } else {
        setCopiedUser(true);
        setTimeout(() => setCopiedUser(false), 2000);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold font-serif-sc text-gray-800">Gemini Prompt 生成结果</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* System Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-indigo-600">第一步：系统角色设定</h3>
              <button
                onClick={() => copyToClipboard(systemPrompt, 'system')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
              >
                {copiedSystem ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono overflow-x-auto">
                {systemPrompt}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              💡 将此内容发送给 Gemini，建立角色设定
            </p>
          </div>

          {/* User Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-emerald-600">第二步：用户提示词</h3>
              <button
                onClick={() => copyToClipboard(userPrompt, 'user')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
              >
                {copiedUser ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono overflow-x-auto">
                {userPrompt}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              💡 等待 Gemini 确认系统角色后，再发送此提示词
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">📋 使用步骤：</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>复制"系统角色设定"并发送给 Gemini</li>
              <li>等待 Gemini 确认理解角色</li>
              <li>复制"用户提示词"并发送给 Gemini</li>
              <li>Gemini 会返回 JSON 格式的分析结果</li>
              <li>将返回的 JSON 保存为文件（如 result.json）</li>
              <li>关闭此窗口，在表单下方上传 JSON 文件</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;

