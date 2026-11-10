'use client';
import { useState } from 'react';
import { strengths, weaknesses } from '../lib/quiz';
type Outcome = { nickname: string; result: string };
export default function Page() {
  const [nickname,setNickname] = useState('');
  const [answers,setAnswers] = useState<(string|null)[]>(Array(30).fill(null));
  const [outcome,setOutcome] = useState<Outcome|null>(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  function choose(index:number,word:string) { setAnswers(previous => previous.map((value,i) => i === index ? word : value)); }
  async function submit(event:React.FormEvent) {
    event.preventDefault(); setError('');
    if (answers.some(value => value === null)) { setError('Choose one word in every row before submitting.'); return; }
    setBusy(true);
    try {
      const response = await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nickname,strengths:answers.slice(0,15),weaknesses:answers.slice(15)})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save your response.');
      setOutcome(data); setNickname(''); setAnswers(Array(30).fill(null));
    } catch(cause) { setError(cause instanceof Error ? cause.message : 'Could not save your response.'); } finally { setBusy(false); }
  }
  return <main><h1>Office Personality Quiz</h1><p>In each row, choose the one word that describes you best or applies to you most often.</p><p className="source-note">Inspired by the YOUnique Personality workbook. Unofficial, noncommercial office activity; no affiliation or endorsement is claimed.</p>{outcome ? <section className="result" role="status"><h2>{outcome.nickname}, your closest match is {outcome.result}.</h2><p>Your response has been saved privately. Refreshing the page clears this result.</p></section> : <form onSubmit={submit}><label className="nickname">Nickname <input value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={40} required autoComplete="nickname" /></label>{([['Strengths',strengths,0],['Weaknesses',weaknesses,15]] as const).map(([title,rows,offset]) => <section key={title}><h2>{title}</h2>{rows.map((row,rowIndex) => <fieldset key={rowIndex}><legend>{offset+rowIndex+1}. Choose one</legend><div className="choices">{row.map(word => <label key={word}><input type="radio" name={`question-${offset+rowIndex}`} checked={answers[offset+rowIndex]===word} onChange={()=>choose(offset+rowIndex,word)} /> {word}</label>)}</div></fieldset>)}</section>)}{error && <p role="alert" className="error">{error}</p>}<button disabled={busy}>{busy?'Saving…':'Submit and see result'}</button></form>}</main>;
}
