import { createClient } from '@supabase/supabase-js';

// 校验环境变量，便于在 Vercel / 本地调试时快速发现问题
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('⚠️ 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY，日志接口将无法写入数据库。');
  // 本地调试示例（请替换为你自己的配置后再取消注释）：
  // process.env.SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
  // process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_key';
} else {
  console.log('[DB Env Check]', {
    urlSet: Boolean(process.env.SUPABASE_URL),
    serviceRoleKeySet: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const toSeconds = (value?: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value / 1000;
  }
  return Date.now() / 1000;
};

// 兼容部分构建环境 req.body 为空的情况，手动解析
const parseBody = async (req: any) => {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return undefined;
      }
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString('utf-8'));
      } catch {
        return undefined;
      }
    }
    return req.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  if (!chunks.length) return undefined;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  } catch {
    return undefined;
  }
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = await parseBody(req);
  const { userId, account, operation, pageData, timestamp } = body || {};
  if (!operation) {
    return res.status(400).json({ error: 'operation required', parsedBody: body });
  }

  try {
    const { error } = await supabase.from('usage_logs').insert({
      user_id: userId || null,
      account: account || null,
      operation,
      page_data: pageData ?? null,
      created_at: new Date(toSeconds(timestamp) * 1000).toISOString(),
    });
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('insert failed', error);
    return res.status(500).json({
      error: 'insert failed',
      detail:
        (error as any)?.message ||
        (typeof error === 'string' ? error : 'unknown error'),
    });
  }
}

