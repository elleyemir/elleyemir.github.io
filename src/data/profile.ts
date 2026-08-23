/**
 * ============================================================================
 *  PROFILE DATA  — edit this file (and timeline.json) to update the site.
 * ============================================================================
 * Every piece of copy about Ali that is not a timeline entry lives here.
 * Components read from this module; nothing is hardcoded in JSX.
 */

import timelineData from './timeline.json';
import type { Timeline, TimelineEntry } from '../types/timeline';

export const timeline = timelineData as Timeline;

export interface SocialLink {
  label: string;
  href: string;
  kind: 'github' | 'linkedin' | 'email';
}

export interface Strength {
  title: string;
  description: string;
  icon: 'layers' | 'monitor' | 'server' | 'compass' | 'sparkles' | 'graduation';
}

export const profile = {
  name: 'Ali Amir',
  identityLine: 'Software Developer • Builder • Chess Enthusiast',
  heroDescription:
    'A self-taught developer who learns by building. I enjoy turning ideas into real, working products — web applications, desktop software and the APIs behind them — for real people and real businesses.',
  email: 'elleyemir@gmail.com',
  github: 'https://github.com/ali-amir-code',
  linkedin: 'https://www.linkedin.com/in/ali-amir-code/',
  /** Short biography used in the About section and in the AI context object. */
  biography: [
    'I am a self-taught software developer and builder. I started learning programming independently through YouTube and other online resources, and kept going because building things was more interesting than only studying theory.',
    'Most of my work sits across web and desktop development, along with the APIs and backend systems that support them. Over time that practice turned into software that real businesses actually use — including production websites and desktop applications delivered through PixelWeave, the software startup I founded.',
    'I like picking up new technologies quickly and putting them straight to work in a project. Away from the editor, I am a chess enthusiast with an interest in chess and chess education — the game rewards the same habits as engineering: patience, pattern recognition, and thinking a few moves ahead.',
  ],
  /** "What I Build" / Strengths — conceptual level only, as specified. */
  strengths: [
    {
      title: 'Full-stack web development',
      description: 'End-to-end web applications, from interface to data layer.',
      icon: 'layers',
    },
    {
      title: 'Desktop applications',
      description: 'Installable tools that businesses run day to day.',
      icon: 'monitor',
    },
    {
      title: 'APIs and backend systems',
      description: 'Services, integrations and the logic behind the screens.',
      icon: 'server',
    },
    {
      title: 'Product development',
      description: 'Taking an idea from rough scope to a shipped product.',
      icon: 'compass',
    },
    {
      title: 'AI-assisted development',
      description: 'Using modern AI tooling to build and iterate faster.',
      icon: 'sparkles',
    },
    {
      title: 'Learning new technologies quickly',
      description: 'Picking up unfamiliar stacks and applying them in real work.',
      icon: 'graduation',
    },
  ] satisfies Strength[],
  /** Chess background — kept strictly to what is known: interest, no ratings or results. */
  chess: {
    summary:
      'Chess is a long-running personal interest, alongside an interest in chess education. It shows up here as a quiet motif rather than the subject of the site.',
    principles: [
      'Study the position before moving.',
      'Small advantages compound.',
      'Every piece should have a purpose.',
    ],
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/ali-amir-code', kind: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-amir-code/', kind: 'linkedin' },
    { label: 'Email', href: 'mailto:elleyemir@gmail.com', kind: 'email' },
  ] satisfies SocialLink[],
} as const;

/* ----------------------------------------------------------------------------
 * AI CONTEXT
 * The assistant's ONLY knowledge source about Ali. Derived from timeline.json
 * plus the profile data above so it can never drift out of sync with the site.
 * -------------------------------------------------------------------------- */

export interface AiTimelineEntry {
  year: number;
  date?: string;
  title: string;
  category?: string;
  description: string;
  links?: string[];
  contentType?: string;
  technologies?: string[];
  highlights?: string[];
}

export interface AiContext {
  name: string;
  headline: string;
  biography: string[];
  skills: string[];
  projects: AiTimelineEntry[];
  timeline: AiTimelineEntry[];
  chess: { summary: string };
  links: { github: string; linkedin: string; portfolioSections: string[] };
  contact: { email: string; formAvailable: boolean };
  constraints: string[];
}

function toAiEntry(entry: TimelineEntry): AiTimelineEntry {
  const content = entry.content;
  const ai: AiTimelineEntry = {
    year: entry.year,
    title: entry.title,
    description: entry.description || entry.shortDescription || '',
  };
  if (entry.date) ai.date = entry.date;
  if (entry.category) ai.category = entry.category;
  if (entry.links?.length) ai.links = entry.links.map((l) => l.url);
  if (content) {
    ai.contentType = content.type;
    if ('technologies' in content && content.technologies?.length) {
      ai.technologies = content.technologies;
    }
    if (content.highlights?.length) ai.highlights = content.highlights;
  }
  return ai;
}

const PROJECT_CONTENT_TYPES = new Set(['project', 'startup']);

/**
 * Build the structured context object sent to the AI proxy with every request.
 */
export function buildAiContext(entries: Timeline = timeline): AiContext {
  const sorted = [...entries].sort((a, b) => a.year - b.year);
  const all = sorted.map(toAiEntry);

  return {
    name: profile.name,
    headline: profile.identityLine,
    biography: [...profile.biography],
    skills: profile.strengths.map((s) => s.title),
    projects: all.filter(
      (e) =>
        (e.contentType && PROJECT_CONTENT_TYPES.has(e.contentType)) ||
        (e.category ? /project|startup/i.test(e.category) : false),
    ),
    timeline: all,
    chess: { summary: profile.chess.summary },
    links: {
      github: profile.github,
      linkedin: profile.linkedin,
      portfolioSections: ['Home', 'About', 'Journey', 'Contact'],
    },
    contact: { email: profile.email, formAvailable: true },
    constraints: [
      'Only answer questions about Ali Amir and the information in this context.',
      'Never invent achievements, jobs, technologies, users, companies, revenue or personal details.',
      'No technology list was provided for Ali\u2019s projects, so do not name specific languages or frameworks he used unless they appear in this context.',
      'Do not claim access to private information or closed-source project internals.',
      'If the answer is not in this context, reply exactly: "I don\u2019t have that information on Ali\u2019s portfolio."',
      'If the question is not about Ali or this portfolio, reply exactly: "I can only answer questions about Ali and this portfolio."',
    ],
  };
}

export const aiContext: AiContext = buildAiContext();

export default profile;
