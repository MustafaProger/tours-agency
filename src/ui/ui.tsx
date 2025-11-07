// ui.tsx
import { cn } from '../utils/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[32px] border border-white/10 bg-gradient-to-br from-[#11111a] via-[#08070f] to-[#05050a] shadow-[0_25px_60px_rgba(5,5,10,0.7)]',
        className,
      )}
      {...props}
    />
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-black tracking-tight text-white">{children}</h2>;
}

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-[0.4em] text-black',
        'bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 shadow-[0_25px_45px_rgba(255,60,60,0.35)] transition hover:brightness-110 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function GhostButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-200',
        'hover:border-white/40 hover:text-white',
        className,
      )}
      {...props}
    />
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300',
        className,
      )}
    >
      {children}
    </span>
  );
}
