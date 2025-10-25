// Header.tsx
import { useState } from "react";
import { MapPin, Menu, X, Calendar } from "lucide-react";
import { Button, GhostButton } from "../ui/ui";

export function Header({ onBookTour }: { onBookTour?: () => void }) {
  const [open, setOpen] = useState(false);

  const Link = ({
    href,
    children,
  }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="px-2 py-1 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      {children}
    </a>
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl ring-1 ring-inset ring-neutral-200/60 dark:ring-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[linear-gradient(135deg,#2563EB,#7C3AED)] shadow-sm">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                Приключенческие туры
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Откройте мир с нами
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#guides">Гиды</Link>
            <Link href="#tours">Туры</Link>
            <Link href="#reviews">Отзывы</Link>
            <Button onClick={onBookTour}>
              <Calendar className="w-4 h-4" />
              Забронировать
            </Button>
          </nav>

          {/* Mobile toggle */}
          <GhostButton
            className="md:hidden h-10 w-10 p-0"
            aria-label="Открыть меню"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </GhostButton>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden border-t border-neutral-200/60 dark:border-neutral-800/60 px-4 py-3 space-y-2">
            <a className="block text-sm font-medium text-neutral-800 dark:text-neutral-100" href="#guides">Гиды</a>
            <a className="block text-sm font-medium text-neutral-800 dark:text-neutral-100" href="#tours">Туры</a>
            <a className="block text-sm font-medium text-neutral-800 dark:text-neutral-100" href="#reviews">Отзывы</a>
            <Button className="w-full" onClick={() => { setOpen(false); onBookTour?.(); }}>
              <Calendar className="w-4 h-4" />
              Забронировать
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}