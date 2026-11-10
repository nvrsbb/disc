'use client';
import { useState } from 'react';
import { options } from '../lib/quiz';
type Outcome = { nickname: string; result: string };
export default function Page() {
  const [nickname, setNickname] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function toggle(id: string, values: string[], set: (v: string[]) => void) { set(values.includes(id) ? values.filter(x => x !== id) : values.length < 4 ? [...values, id] : values); }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('');
    if (!strengths.length || !weaknesses.length) { setError('Choose at least one word in each group.'); return; }
    setBusy(true);
    try {
      const response = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname, strengths, weaknesses }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save your response.');
      setOutcome(data); setNickname(''); setStrengths([]); setWeaknesses([]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save your response.'); } finally { setBusy(false); }
  }
  return <main><h1>Office Personality Quiz</h1><p>For fun and self-reflection. This is not a psychological diagnosis.</p><p className="source-note">Inspired by the YOUnique Personality workbook. Unofficial, noncommercial office activity; no affiliation or endorsement is claimed.</p>{outcome ? <section className="result" role="status"><h2>{outcome.nickname}, your closest match is {outcome.result}.</h2><p>Your response has been saved privately. This result is shown only now; refreshing the page clears it.</p></section> : <form onSubmit={submit}><label className="nickname">Nickname <input value={nickname} onChange={e => setNickname(e.target.value)} maxLength={40} required autoComplete="nickname" /></label>{(['strengths', 'weaknesses'] as const).map(kind => { const values = kind === 'strengths' ? strengths : weaknesses; const setter = kind === 'strengths' ? setStrengths : setWeaknesses; return <fieldset key={kind}><legend>Choose 1–4 {kind} ({values.length}/4)</legend><div className="choices">{options(kind).map(item => <label key={item.id}><input type="checkbox" checked={values.includes(item.id)} onChange={() => toggle(item.id, values, setter)} /> {item.word}</label>)}</div></fieldset>; })}{error && <p role="alert" className="error">{error}</p>}<button disabled={busy}>{busy ? 'Saving…' : 'Submit and see result'}</button></form>}</main>;
}
