// ui.tsx
import { cn } from "../utils/utils"; // см. utils ниже

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/90 dark:bg-neutral-950/90 ring-1 ring-neutral-200/70 dark:ring-neutral-800/70 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">{children}</h2>
  );
}

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white",
        "bg-[linear-gradient(135deg,#2563EB,#7C3AED)] hover:brightness-105 active:brightness-100",
        "shadow-sm disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export function GhostButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
        "text-neutral-700 dark:text-neutral-200 ring-1 ring-inset ring-neutral-200/70 dark:ring-neutral-800/70",
        "hover:bg-white/70 dark:hover:bg-neutral-900/70",
        className
      )}
      {...props}
    />
  );
}

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        "ring-neutral-200/70 dark:ring-neutral-800/70 text-neutral-700 dark:text-neutral-200",
        className
      )}
    >
      {children}
    </span>
  );
}