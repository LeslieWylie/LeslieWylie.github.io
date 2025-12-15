import React, { useState } from 'react';
import { Copy, Check, X, ExternalLink, AlertTriangle, Info } from 'lucide-react';

interface PromptDisplayProps {
  systemPrompt: string;
  userPrompt: string;
  onClose: () => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ systemPrompt, userPrompt, onClose }) => {
  const [copiedSystem, setCopiedSystem] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedAI, setSelectedAI] = useState<'gemini' | 'doubao'>('gemini');

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

  const copyAllPrompt = () => {
    const fullText = `## 系统角色设定\n\n${systemPrompt}\n\n---\n\n## 用户提示词\n\n${userPrompt}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedSystem(true);
      setCopiedUser(true);
      setCopiedAll(true);
      setTimeout(() => {
        setCopiedSystem(false);
        setCopiedUser(false);
        setCopiedAll(false);
      }, 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold font-serif-sc text-gray-800">AI Prompt 生成结果</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI 平台选择 */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedAI('gemini')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                selectedAI === 'gemini'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>Google Gemini</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">推荐</span>
            </button>
            <button
              onClick={() => setSelectedAI('doubao')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                selectedAI === 'doubao'
                  ? 'bg-amber-50 border-amber-500 text-amber-700 font-semibold'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>字节豆包</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">可能不完整</span>
            </button>
          </div>

          {/* 平台说明 */}
          <div className={`p-3 rounded-lg mb-4 ${
            selectedAI === 'gemini' 
              ? 'bg-indigo-50 border border-indigo-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-2">
              {selectedAI === 'gemini' ? (
                <>
                  <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-indigo-800">
                    <strong>Google Gemini：</strong>完全支持，可以输出完整的 JSON 数据，推荐使用。
                    <a 
                      href="https://gemini.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
                    >
                      打开 Gemini <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>字节豆包：</strong>可以使用相同的 Prompt，但<strong>可能无法输出完整的 JSON 数据</strong>。
                    如果遇到输出不完整的情况，建议：
                    <ul className="mt-1 space-y-1 list-disc list-inside ml-2">
                      <li>要求 AI 继续输出完整内容</li>
                      <li>检查输出格式是否为有效 JSON</li>
                      <li>使用 Gemini 重新生成（推荐）</li>
                    </ul>
                    <a 
                      href="https://www.doubao.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-amber-600 hover:text-amber-800 underline inline-flex items-center gap-1"
                    >
                      打开豆包 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* System Prompt */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-indigo-600">第一步：系统角色设定</h3>
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
            <h3 className="text-lg font-bold text-emerald-600">第二步：用户提示词</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono overflow-x-auto">
                {userPrompt}
              </pre>
            </div>
            <p className="text-sm text-gray-500">
              💡 等待 Gemini 确认系统角色后，再发送此提示词
            </p>
            </div>

          {/* 复制区域：分开复制 + 一键复制 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 space-y-3">
            <h4 className="font-bold text-indigo-900 mb-1">复制 Prompt</h4>
            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={() => copyToClipboard(systemPrompt, 'system')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-semibold"
              >
                {copiedSystem ? (
                  <>
                    <Check className="w-4 h-4" />
                    系统角色已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制系统角色设定
                  </>
                )}
              </button>
              <button
                onClick={() => copyToClipboard(userPrompt, 'user')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-semibold"
              >
                {copiedUser ? (
                  <>
                    <Check className="w-4 h-4" />
                    用户提示词已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制用户提示词
                  </>
                )}
              </button>
              <button
                onClick={copyAllPrompt}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制全部
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    一键复制完整对话
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-indigo-700">
              建议先复制<strong>系统角色设定</strong>并发送给 AI，确认无误后再复制<strong>用户提示词</strong>。
              也可以使用<strong>一键复制完整对话</strong>快速粘贴。
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">📋 使用步骤：</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>复制"系统角色设定"并发送给 {selectedAI === 'gemini' ? 'Gemini' : '豆包'}</li>
              <li>等待 AI 确认理解角色</li>
              <li>复制"用户提示词"并发送给 {selectedAI === 'gemini' ? 'Gemini' : '豆包'}</li>
              <li>AI 会返回 JSON 格式的分析结果{selectedAI === 'doubao' && '（如果输出不完整，请要求继续输出）'}</li>
              <li>将返回的 JSON 保存为文件（如 result.json）或直接粘贴到上传区域</li>
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

