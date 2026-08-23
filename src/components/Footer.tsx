import { Github, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';
import profile from '../data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-parchment/[0.1] py-10">
      <div className="shell flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo />
        <p className="order-3 text-center text-xs text-parchment/[0.4] sm:order-2 sm:text-left">
          © {new Date().getFullYear()} Ali Amir. Built with React, Vite and Tailwind CSS.
        </p>
        <ul className="order-2 flex items-center gap-2 sm:order-3">
          {[
            { icon: Github, label: 'GitHub', href: profile.github },
            { icon: Linkedin, label: 'LinkedIn', href: profile.linkedin },
            { icon: Mail, label: 'Email Ali', href: `mailto:${profile.email}` },
          ].map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <a
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-parchment/[0.12] text-parchment/[0.55] transition-colors hover:border-gold-500/[0.4] hover:text-gold-400"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
