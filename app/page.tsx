'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { strengths, weaknesses, traits, keys, type Trait } from '../lib/quiz';
import { profiles } from '../lib/profiles';
type Outcome = { nickname: string; result: string; trait: Trait; strengthScores: Record<Trait, number>; weaknessScores: Record<Trait, number>; scores: Record<Trait, number> };
export default function Page() {
  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {}); }, []);
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
  return <main><h1>Office Personality Quiz</h1><p>In each row, choose the one word that describes you best or applies to you most often.</p><p className="source-note">Inspired by the YOUnique Personality workbook. Unofficial, noncommercial office activity; no affiliation or endorsement is claimed.</p>{outcome ? <section className="result" role="status"><div className="result-hero"><Image src={`/animals/${outcome.trait}.webp`} alt={`Illustration of ${outcome.result}`} width={280} height={280} priority /><div><h2>{outcome.nickname}, your closest match is {outcome.result}.</h2><p className="result-intro">{profiles[outcome.trait].overview}</p></div></div><p className="source-note">These descriptions are adapted from the YOUnique workbook and are for reflection and fun, not a diagnosis.</p><ScoreTally outcome={outcome} /><ProfileLists trait={outcome.trait} /><h3>Meet the other personalities</h3>{keys.filter(key => key !== outcome.trait).map(key => <details className="other-profile" key={key}><summary><Image src={`/animals/${key}.webp`} alt="" width={56} height={56} />{traits[key]}</summary><p>{profiles[key].overview}</p><ProfileLists trait={key} /></details>)}<p className="source-note">Your response has been saved privately. Refreshing the page clears this result.</p></section> : <form onSubmit={submit}><div className="quiz-hero"><div className="animal-parade" aria-label="Meet the four animal personalities">{keys.map(key => <Image key={key} src={`/animals/${key}.webp`} alt={key === "dominant" ? "Eagle" : key === "influential" ? "Rooster" : key === "steady" ? "Carabao" : "Tarsier"} width={108} height={108} />)}</div><p>Alin kaya ang ka-vibe mo? 🐾</p></div><div className="quiz-progress"><span>{answers.filter(Boolean).length} of 30 answered</span><progress value={answers.filter(Boolean).length} max={30} aria-label="Quiz progress" /></div><label className="nickname">Nickname <input value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={40} required autoComplete="nickname" /></label>{([['Strengths',strengths,0],['Weaknesses',weaknesses,15]] as const).map(([title,rows,offset]) => <section key={title}><h2>{title}</h2>{rows.map((row,rowIndex) => <fieldset key={rowIndex}><legend>{offset+rowIndex+1}. Choose one</legend><div className="choices">{row.map(word => <label key={word} className={answers[offset+rowIndex]===word?"choice selected":"choice"}><input type="radio" name={`question-${offset+rowIndex}`} checked={answers[offset+rowIndex]===word} onChange={()=>choose(offset+rowIndex,word)} /> <span>{word}</span></label>)}</div></fieldset>)}</section>)}{error && <p role="alert" className="error">{error}</p>}<button disabled={busy}>{busy?'Excited ka na bang malaman? 👀':'Submit and see result'}</button></form>}</main>;
}

function ProfileLists({ trait }: { trait: Trait }) {
  const profile = profiles[trait];
  return <div className="profile-lists"><section><h3>Strengths</h3><ul>{profile.strengths.map(item => <li key={item}>{item}</li>)}</ul></section><section><h3>Weaknesses</h3><ul>{profile.weaknesses.map(item => <li key={item}>{item}</li>)}</ul></section></div>;
}

function ScoreTally({ outcome }: { outcome: Outcome }) {
  const leaders = (scores: Record<Trait, number>) => {
    const highest = Math.max(...keys.map(key => scores[key]));
    return `${keys.filter(key => scores[key] === highest).map(key => traits[key]).join(' and ')} (${highest})`;
  };
  const tiedTotal = keys.filter(key => outcome.scores[key] === outcome.scores[outcome.trait]).length > 1;
  return <section className="score-section"><h3>How your result was counted</h3><p>Each chosen word adds one point to its DISC type. Strength and weakness points are added together; weaknesses are not subtracted.</p><div className="score-scroll"><table className="score-table"><thead><tr><th>Personality</th><th>Strengths</th><th>Weaknesses</th><th>Total</th></tr></thead><tbody>{keys.map(key => <tr key={key} className={key === outcome.trait ? 'score-winner' : undefined}><th scope="row">{traits[key]}</th><td>{outcome.strengthScores[key]}</td><td>{outcome.weaknessScores[key]}</td><td>{outcome.scores[key]}</td></tr>)}</tbody></table></div><p className="score-explanation">Your strengths most often matched {leaders(outcome.strengthScores)}. Your weaknesses most often matched {leaders(outcome.weaknessScores)}. Together, {outcome.result} had {outcome.scores[outcome.trait]} of your 30 choices.</p>{tiedTotal && <p className="source-note">The top total was tied; the workbook gives no tie rule, so the first type in DISC order is shown.</p>}</section>;
}
