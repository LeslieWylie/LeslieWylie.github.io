import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

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
    await pool.query(
      `insert into usage_logs (user_id, account, operation, page_data, created_at)
       values ($1, $2, $3, $4, to_timestamp($5))`,
      [
        userId || null,
        account || null,
        operation,
        pageData || {},
        toSeconds(timestamp),
      ]
    );
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

