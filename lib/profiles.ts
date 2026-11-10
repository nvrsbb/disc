import type { Trait } from './quiz';

// Adapted from the user's photos of the YOUnique workbook, pages 9–13.
export const profiles: Record<Trait, { overview: string; strengths: readonly string[]; weaknesses: readonly string[] }> = {
  dominant: {
    overview: 'A force of nature who enjoys challenges, goals, and taking charge.',
    strengths: ['Takes Charge & Control','Gets Things Done','Makes Quick Decisions','Solves Practical Problems','Goal Oriented','Accepts Challenges','Hard Worker','Organizes Well','Delegates','Persistent'],
    weaknesses: ['Strong Personality','Compulsive Need for Change','Has Little Need for Friends','Insensitive','Overlooks Risks & Cautions','Takes on Too Much','Too Demanding','Impatient','Inflexible and Unyielding','Inattentive to Detail'],
  },
  influential: {
    overview: 'A people-person who enjoys making friends, sharing energy, and lifting the mood.',
    strengths: ['Optimistic','People Person','Entertaining','Articulate','Energetic & Enthusiastic','Charming','Child at Heart','Inspiring','Good Sense of Humor','Fun'],
    weaknesses: ['Talks Too Much','Peter Pan Syndrome','Hungry for Approval','Lacks Follow-Through','Forgetful','Acts Impulsively','Over Commits','Misjudges Capabilities','Exaggerates','Verbally Manipulative'],
  },
  steady: {
    overview: 'A calm, dependable presence who likes to keep their cool and support others.',
    strengths: ['Easy Going','Loyal','Patient','Good Administrator','Consistent','Agreeable','A Good Listener','Service Oriented','Builds Relationships','Realistic'],
    weaknesses: ['Tolerant','Resists Change','Stubborn','Procrastinates','Indecisive','Indirect with Others','Can’t Say No','Difficulty with Deadlines','Avoids Conflict','Lacks Initiative'],
  },
  corrective: {
    overview: 'An attentive thinker who values details, facts, data, and quality.',
    strengths: ['Competent','Orderly','Self-Disciplined','Committed to Quality','Thinker','Accurate','Analytical','Organized','Sensitive','Thorough'],
    weaknesses: ['Analysis Paralysis','Pessimistic','Sensitive to Criticism','Gloomy','Suspicious','Too Rigid','Fault Finder','Too Detail Oriented','Naively Idealistic','Historical'],
  },
};
