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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, account, operation, pageData, timestamp } = req.body || {};
  if (!operation) {
    return res.status(400).json({ error: 'operation required' });
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
    return res.status(500).json({ error: 'insert failed' });
  }
}

