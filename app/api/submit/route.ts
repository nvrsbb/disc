import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { options, score } from '../../../lib/quiz';
import { saveResponse } from '../../../lib/ledger';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 4096) return NextResponse.json({ error: 'Response too large.' }, { status: 413 });
    const data = await request.json();
    const nickname = data?.nickname;
    const strengths = data?.strengths;
    const weaknesses = data?.weaknesses;
    if (typeof nickname !== 'string' || !/^[\p{L}\p{N} _.-]{1,40}$/u.test(nickname.trim())) throw new Error('Enter a nickname of 1–40 characters.');
    for (const [values, kind] of [[strengths, 'strengths'], [weaknesses, 'weaknesses']] as const) {
      const allowed = new Set(options(kind).map(item => item.id));
      if (!Array.isArray(values) || values.length < 1 || values.length > 4 || new Set(values).size !== values.length || values.some(value => typeof value !== 'string' || !allowed.has(value))) throw new Error('Choose 1–4 valid words in each group.');
    }
    const outcome = score(strengths, weaknesses);
    const record = { id: randomUUID(), submittedAt: new Date().toISOString(), nickname: nickname.trim(), strengths, weaknesses, scores: outcome.scores, result: outcome.winner };
    await saveResponse(record);
    return NextResponse.json({ nickname: record.nickname, result: outcome.result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not save the response.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
}
