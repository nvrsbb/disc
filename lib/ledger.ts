import { mkdir, open } from 'node:fs/promises';
import path from 'node:path';

export type ResponseRecord = { id: string; submittedAt: string; nickname: string; strengths: string[]; weaknesses: string[]; strengthScores: Record<string, number>; weaknessScores: Record<string, number>; scores: Record<string, number>; result: string };
const filename = (id: string) => `responses/${id}.json`;

export async function saveResponse(record: ResponseRecord) {
  const repo = process.env.RESPONSES_REPO;
  const token = process.env.RESPONSES_GITHUB_TOKEN;
  if (repo || token) {
    if (!repo || !token || !/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('Private response ledger is not fully configured.');
    const branch = process.env.RESPONSES_BRANCH || 'main';
    const content = Buffer.from(JSON.stringify(record, null, 2) + '\n').toString('base64');
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filename(record.id)}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Save quiz response ${record.id}`, content, branch }), cache: 'no-store' });
    if (!response.ok) throw new Error(`Private response ledger rejected the save (${response.status}).`);
    return;
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Private response ledger is not configured.');
  const dir = path.resolve(process.env.RESPONSES_DIR || '.responses');
  await mkdir(dir, { recursive: true });
  const file = await open(path.join(dir, `${record.id}.json`), 'wx');
  try { await file.writeFile(JSON.stringify(record, null, 2) + '\n'); } finally { await file.close(); }
}
