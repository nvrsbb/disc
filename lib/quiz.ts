export const traits = {
  dominant: 'Dominant Eagle',
  influential: 'Influential Rooster',
  steady: 'Steady Carabao',
  corrective: 'Corrective Tarsier',
} as const;
export type Trait = keyof typeof traits;
export const keys = Object.keys(traits) as Trait[];

// Page 6 of the supplied workbook: one word is chosen in each row.
export const strengths = [
  ['Reliable','Resourceful','Rejoicing','Relaxed'],
  ['Analytical','Animated','Adaptable','Aggressive'],
  ['Forceful','Fun','Friendly','Formal'],
  ['Gentle','Generous','Good Listener','Get Things Done'],
  ['Correct','Competitive','Careful','Cute'],
  ['Persuasive','Popular','Planner','Personable'],
  ['Inspiring','Independent','Intellectual','Inoffensive'],
  ['Bold','Behaved','Balanced','Bouncy'],
  ['Easygoing','Efficient','Exciting','Economical'],
  ['Sensitive','Self-Reliant','Supportive','Spontaneous'],
  ['Determined','Daring','Dependable','Disciplined'],
  ['Mediator','Mover','Mesmerizing','Mindful'],
  ['Tolerant','Thorough','Takes Charge','Talker'],
  ['Outspoken','Orderly','Optimistic','Obliging'],
  ['Loyal','Leader','Lively','Learner'],
] as const;
export const weaknesses = [
  ['Flighty','Forgetful','Fearful','Flagrant'],
  ['Argumentative','Avoids Conflict','Angered Easily','Analysis Paralysis'],
  ['Nagger','Negative','Naive','Nonchalant'],
  ['Doubting','Depressed','Disorganized','Dictator'],
  ['Manipulative','My Way','Moody','Minority'],
  ['Bossy','Big Mouthed','Bum Around','Bashful'],
  ['Hesitant','Hard to Please','Hard Headed','Haphazard'],
  ['Too Sensitive','Tactless','Timid','Talkative'],
  ['Critical','Compromising','Commanding','Crafty'],
  ['Resistant','Restless','Reluctant','Resentful'],
  ['Indecisive','Impulsive','Idealistic','Impatient'],
  ['Stoic','Show Off','Skeptical','Short-Tempered'],
  ['Workaholic','Wants Attention','Withdrawn','Worrier'],
  ['Lazy','Loud','Lord It Over','Lacks Spontaneity'],
  ['Perfectionist','Procrastinator','Pushy','Pesky'],
] as const;

// Page 7: each scoring column maps words to one DISC type.
const mapped: Record<Trait, { strengths: readonly string[]; weaknesses: readonly string[] }> = {
  dominant: {
    strengths: ['Resourceful','Aggressive','Forceful','Get Things Done','Competitive','Persuasive','Independent','Bold','Efficient','Self-Reliant','Determined','Mover','Takes Charge','Outspoken','Leader'],
    weaknesses: ['Flagrant','Angered Easily','Nagger','Dictator','My Way','Bossy','Hard to Please','Tactless','Commanding','Resistant','Impatient','Short-Tempered','Workaholic','Lord It Over','Pushy'],
  },
  influential: {
    strengths: ['Rejoicing','Animated','Fun','Generous','Cute','Popular','Inspiring','Bouncy','Exciting','Spontaneous','Daring','Mesmerizing','Talker','Optimistic','Lively'],
    weaknesses: ['Forgetful','Argumentative','Naive','Disorganized','Manipulative','Big Mouthed','Haphazard','Talkative','Crafty','Restless','Impulsive','Show Off','Wants Attention','Loud','Pesky'],
  },
  steady: {
    strengths: ['Relaxed','Adaptable','Friendly','Good Listener','Careful','Personable','Inoffensive','Behaved','Easygoing','Supportive','Dependable','Mediator','Tolerant','Obliging','Loyal'],
    weaknesses: ['Fearful','Avoids Conflict','Nonchalant','Doubting','Minority','Bum Around','Hard Headed','Timid','Compromising','Reluctant','Indecisive','Stoic','Worrier','Lazy','Procrastinator'],
  },
  corrective: {
    strengths: ['Reliable','Analytical','Formal','Gentle','Correct','Planner','Intellectual','Balanced','Economical','Sensitive','Disciplined','Mindful','Thorough','Orderly','Learner'],
    weaknesses: ['Flighty','Analysis Paralysis','Negative','Depressed','Moody','Bashful','Hesitant','Too Sensitive','Critical','Resentful','Idealistic','Skeptical','Withdrawn','Lacks Spontaneity','Perfectionist'],
  },
};
export const mapping = Object.fromEntries((['strengths','weaknesses'] as const).map(kind => [kind, Object.fromEntries(keys.flatMap(key => mapped[key][kind].map(word => [word,key])))])) as Record<'strengths'|'weaknesses',Record<string,Trait>>;
export function validateSelections(selected: unknown, kind: 'strengths'|'weaknesses'): selected is string[] {
  return Array.isArray(selected) && selected.length === 15 && selected.every((word, row) => typeof word === 'string' && (kind === 'strengths' ? strengths : weaknesses)[row].includes(word as never));
}
export function score(selectedStrengths: string[], selectedWeaknesses: string[]) {
  const scores = Object.fromEntries(keys.map(key => [key, selectedStrengths.filter(word => mapping.strengths[word] === key).length + selectedWeaknesses.filter(word => mapping.weaknesses[word] === key).length])) as Record<Trait,number>;
  const winner = keys.reduce((best,key) => scores[key] > scores[best] ? key : best);
  return { scores, winner, result: traits[winner] };
}
