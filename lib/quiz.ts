export const traits = {
  eagle: { name: 'Dominant Eagle', strengths: ['decisive', 'takes charge', 'goal focused', 'bold'], weaknesses: ['impatient', 'too demanding'] },
  rooster: { name: 'Influential Rooster', strengths: ['outgoing', 'optimistic', 'expressive', 'encouraging'], weaknesses: ['talks too much', 'acts impulsively'] },
  carabao: { name: 'Steady Carabao', strengths: ['patient', 'loyal', 'consistent', 'supportive'], weaknesses: ['avoids conflict', 'resists change'] },
  tarsier: { name: 'Corrective Tarsier', strengths: ['careful', 'organized', 'analytical', 'detail focused'], weaknesses: ['overthinks', 'too critical'] },
} as const;
export type Trait = keyof typeof traits;
export const keys = Object.keys(traits) as Trait[];
export const options = (kind: 'strengths' | 'weaknesses') => keys.flatMap(key => traits[key][kind].map(word => ({ id: `${key}:${word}`, word })));
export function score(strengths: string[], weaknesses: string[]) {
  const scores = Object.fromEntries(keys.map(key => [key, [...strengths, ...weaknesses].filter(value => value.startsWith(`${key}:`)).length])) as Record<Trait, number>;
  const winner = keys.reduce((best, key) => scores[key] > scores[best] ? key : best);
  return { scores, winner, result: traits[winner].name };
}
