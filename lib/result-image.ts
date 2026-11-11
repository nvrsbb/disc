import { keys, traits, type Trait } from './quiz';
import { profiles } from './profiles';

export type ResultForImage = {
  nickname: string;
  result: string;
  trait: Trait;
  strengthScores: Record<Trait, number>;
  weaknessScores: Record<Trait, number>;
  scores: Record<Trait, number>;
};

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number) {
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else line = next;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

async function loadAnimal(trait: Trait) {
  const image = new Image();
  image.src = `/animals/${trait}.webp`;
  await image.decode();
  return image;
}

export async function downloadResultImage(result: ResultForImage) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1740;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image creation is unavailable in this browser.');
  const animal = await loadAnimal(result.trait);
  const profile = profiles[result.trait];

  ctx.fillStyle = '#f8f3ef';
  ctx.fillRect(0, 0, 1080, 1740);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.roundRect(40, 40, 1000, 1660, 36); ctx.fill();
  ctx.fillStyle = '#fceef1';
  ctx.beginPath(); ctx.roundRect(70, 70, 940, 400, 28); ctx.fill();
  ctx.drawImage(animal, 660, 92, 305, 305);
  ctx.fillStyle = '#8d3443'; ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('OFFICE PERSONALITY QUIZ', 108, 130);
  ctx.fillStyle = '#302a2a'; ctx.font = 'bold 48px system-ui, sans-serif';
  let titleY = wrap(ctx, `${result.nickname}'s result`, 108, 205, 515, 58);
  ctx.fillStyle = '#a54051'; ctx.font = 'bold 43px system-ui, sans-serif';
  titleY = wrap(ctx, result.result, 108, titleY + 8, 515, 52);
  ctx.fillStyle = '#493c3e'; ctx.font = '25px system-ui, sans-serif';
  wrap(ctx, profile.overview, 108, titleY + 12, 520, 36);

  ctx.fillStyle = '#302a2a'; ctx.font = 'bold 32px system-ui, sans-serif';
  ctx.fillText('Your score tally', 88, 535);
  ctx.font = '22px system-ui, sans-serif';
  wrap(ctx, 'Each chosen word adds one point. Strengths and weaknesses are added together.', 88, 573, 890, 30);
  ctx.fillStyle = '#8d3443'; ctx.font = 'bold 23px system-ui, sans-serif';
  ctx.fillText('PERSONALITY', 100, 660);
  ctx.textAlign = 'center';
  ctx.fillText('STRENGTHS', 715, 660); ctx.fillText('WEAKNESSES', 865, 660); ctx.fillText('TOTAL', 975, 660);
  ctx.textAlign = 'left';
  keys.forEach((key, index) => {
    const y = 710 + index * 64;
    if (key === result.trait) { ctx.fillStyle = '#fceef1'; ctx.fillRect(85, y - 37, 910, 56); }
    ctx.fillStyle = '#302a2a'; ctx.font = key === result.trait ? 'bold 25px system-ui, sans-serif' : '25px system-ui, sans-serif';
    ctx.fillText(traits[key], 100, y);
    ctx.textAlign = 'center';
    ctx.fillText(String(result.strengthScores[key]), 715, y);
    ctx.fillText(String(result.weaknessScores[key]), 865, y);
    ctx.fillText(String(result.scores[key]), 975, y);
    ctx.textAlign = 'left';
  });
  const ties = keys.filter(key => result.scores[key] === result.scores[result.trait]);
  ctx.fillStyle = '#493c3e'; ctx.font = '22px system-ui, sans-serif';
  if (ties.length > 1) wrap(ctx, `Top score tied with ${ties.filter(key => key !== result.trait).map(key => traits[key]).join(' and ')}. The quiz shows the first type in DISC order.`, 100, 990, 870, 29);
  else ctx.fillText(`${result.result} had the highest total: ${result.scores[result.trait]} of 30.`, 100, 990);

  const column = (heading: string, items: readonly string[], x: number) => {
    ctx.fillStyle = '#8d3443'; ctx.font = 'bold 29px system-ui, sans-serif'; ctx.fillText(heading, x, 1080);
    ctx.fillStyle = '#302a2a'; ctx.font = '22px system-ui, sans-serif';
    let y = 1125;
    items.forEach(item => { y = wrap(ctx, `• ${item}`, x, y, 400, 38); });
  };
  column('Strengths', profile.strengths, 100);
  column('Weaknesses', profile.weaknesses, 555);
  ctx.fillStyle = '#6e6466'; ctx.font = '19px system-ui, sans-serif';
  wrap(ctx, 'Inspired by the YOUnique workbook. Unofficial, noncommercial office activity. For fun and reflection, not a diagnosis.', 100, 1650, 880, 25);

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Could not create the image.')), 'image/png'));
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${result.nickname.trim().replace(/[^a-z0-9_-]+/gi, '-').slice(0, 40) || 'quiz'}-personality-result.png`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
