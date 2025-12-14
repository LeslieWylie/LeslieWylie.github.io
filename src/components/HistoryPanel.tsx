import React, { useState, useEffect } from 'react';
import { History, X, Search, Trash2, Clock, Loader2 } from 'lucide-react';
import { HistoryItem, getHistory, removeFromHistory, clearHistory, searchHistory } from '../utils/storage';
import { BaziInput, LifeDestinyResult } from '../types';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadHistory: (baziInput: BaziInput, result?: LifeDestinyResult) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onLoadHistory }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      const items = searchQuery ? searchHistory(searchQuery) : getHistory();
      setHistory(items);
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [searchQuery, isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这条历史记录吗？')) {
      removeFromHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleLoad = (item: HistoryItem) => {
    onLoadHistory(item.baziInput, item.result);
    onClose();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">历史记录</h2>
            <span className="text-sm text-gray-500">({history.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索历史记录..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">
                {searchQuery ? '没有找到匹配的记录' : '暂无历史记录'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLoad(item)}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {item.name || '未命名'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(item.timestamp)}</span>
                      </div>
                      <div className="text-xs text-gray-600 font-mono bg-white px-2 py-1 rounded inline-block">
                        {item.baziInput.yearPillar} {item.baziInput.monthPillar}{' '}
                        {item.baziInput.dayPillar} {item.baziInput.hourPillar}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.result && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>已包含分析结果</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleClearAll}
              className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              清空所有记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;

