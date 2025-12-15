export type UsageOperation = 'generatePrompt' | 'uploadResult' | 'loadHistory' | 'view' | 'feedback';

export interface UsageEvent {
  userId?: string;
  account?: string;
  operation: UsageOperation;
  pageData?: Record<string, unknown>;
  timestamp?: number;
}

const LOG_ENDPOINT = import.meta.env.VITE_LOG_ENDPOINT;

/**
 * 轻量级埋点：将操作记录发送到后端日志接口
 * - 默认使用 sendBeacon 保证页面关闭时也能发出
 * - 若未配置 LOG_ENDPOINT，则静默跳过
 */
export const logUsage = (event: UsageEvent): void => {
  if (!LOG_ENDPOINT) {
    return;
  }

  const payload = {
    timestamp: event.timestamp ?? Date.now(),
    ...event,
  };

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(LOG_ENDPOINT, blob);
      return;
    }

    fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((error) => {
      console.error('logUsage fetch failed:', error);
    });
  } catch (error) {
    console.error('logUsage failed:', error);
  }
};

