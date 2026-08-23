import {
  Award,
  Briefcase,
  Building2,
  Code2,
  Gamepad2,
  GitBranch,
  Globe,
  GraduationCap,
  Layers,
  MessageSquare,
  Monitor,
  Rocket,
  Server,
  Compass,
  Sparkles,
  Terminal,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

/** Icon map for timeline entries — JSON refers to these keys by name. */
export const timelineIcons: Record<string, LucideIcon> = {
  code: Code2,
  terminal: Terminal,
  git: GitBranch,
  gamepad: Gamepad2,
  message: MessageSquare,
  globe: Globe,
  rocket: Rocket,
  briefcase: Briefcase,
  trophy: Trophy,
  building: Building2,
  monitor: Monitor,
  graduation: GraduationCap,
  sparkles: Sparkles,
  award: Award,
};

export function timelineIcon(name?: string): LucideIcon {
  if (name && timelineIcons[name]) return timelineIcons[name];
  return Sparkles;
}

/** Icon map for the "What I Build" strengths. */
export const strengthIcons: Record<string, LucideIcon> = {
  layers: Layers,
  monitor: Monitor,
  server: Server,
  compass: Compass,
  sparkles: Sparkles,
  graduation: GraduationCap,
};
