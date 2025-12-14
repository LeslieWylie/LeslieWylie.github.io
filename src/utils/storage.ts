import { BaziInput, LifeDestinyResult } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: number;
  baziInput: BaziInput;
  result?: LifeDestinyResult;
  name?: string;
}

const STORAGE_KEY = 'bazi_history';
const MAX_HISTORY = 50;

// 保存到历史记录
export const saveToHistory = (
  baziInput: BaziInput,
  result?: LifeDestinyResult
): HistoryItem => {
  const history = getHistory();
  const newItem: HistoryItem = {
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    baziInput,
    result,
    name: baziInput.name || `${baziInput.birthYear}年 ${baziInput.yearPillar} ${baziInput.monthPillar} ${baziInput.dayPillar} ${baziInput.hourPillar}`,
  };
  
  // 移除重复项（基于八字四柱）
  const uniqueHistory = history.filter(
    (item) =>
      !(
        item.baziInput.yearPillar === baziInput.yearPillar &&
        item.baziInput.monthPillar === baziInput.monthPillar &&
        item.baziInput.dayPillar === baziInput.dayPillar &&
        item.baziInput.hourPillar === baziInput.hourPillar &&
        item.baziInput.birthYear === baziInput.birthYear
      )
  );
  
  uniqueHistory.unshift(newItem);
  const limitedHistory = uniqueHistory.slice(0, MAX_HISTORY);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
  
  return newItem;
};

// 获取历史记录
export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as HistoryItem[];
  } catch (error) {
    console.error('读取历史记录失败:', error);
    return [];
  }
};

// 从历史记录删除
export const removeFromHistory = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('删除历史记录失败:', error);
  }
};

// 清空历史记录
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清空历史记录失败:', error);
  }
};

// 更新历史记录（添加结果）
export const updateHistoryItem = (id: string, result: LifeDestinyResult): void => {
  const history = getHistory();
  const index = history.findIndex((item) => item.id === id);
  if (index !== -1) {
    history[index].result = result;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('更新历史记录失败:', error);
    }
  }
};

// 搜索历史记录
export const searchHistory = (query: string): HistoryItem[] => {
  const history = getHistory();
  if (!query.trim()) return history;
  
  const lowerQuery = query.toLowerCase();
  return history.filter(
    (item) =>
      item.name?.toLowerCase().includes(lowerQuery) ||
      item.baziInput.yearPillar.includes(query) ||
      item.baziInput.monthPillar.includes(query) ||
      item.baziInput.dayPillar.includes(query) ||
      item.baziInput.hourPillar.includes(query) ||
      item.baziInput.birthYear.includes(query)
  );
};

