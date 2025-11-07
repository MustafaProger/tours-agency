// Header.tsx
import { useState } from 'react';
import { Gauge, Menu, X, Calendar, Sparkles } from 'lucide-react';
import { Button, GhostButton } from '../ui/ui';

interface HeaderProps {
  onBookExperience?: () => void;
}

const links = [
  { href: '#drivers', label: 'Pilots' },
  { href: '#experiences', label: 'Programs' },
  { href: '#reviews', label: 'Voices' },
];

export function Header({ onBookExperience }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-colors"
    >
      {children}
    </a>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <a href="#" className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-orange-500 to-amber-400 text-white shadow-[0_0_25px_rgba(255,60,60,0.4)]">
            <Gauge className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <span className="text-xl font-black tracking-[0.4em] uppercase">SuperCar</span>
            <p className="text-[11px] uppercase tracking-[0.5em] text-slate-400">Circuit Division</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Button onClick={onBookExperience}>
            <Calendar className="h-4 w-4" />
            Book Track
          </Button>
        </nav>

        <GhostButton className="md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </GhostButton>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="space-y-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-semibold uppercase tracking-[0.3em] text-slate-200"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                onBookExperience?.();
              }}
            >
              <Sparkles className="h-4 w-4" />
              Launch Session
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
