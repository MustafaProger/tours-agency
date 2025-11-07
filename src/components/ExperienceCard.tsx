import { AlarmClock, Activity, MapPin, Users } from 'lucide-react';
import type { Experience } from '../lib/api';

interface ExperienceCardProps {
  experience: Experience;
  onSelect?: (experienceId?: number) => void;
}

const intensityMap: Record<string, string> = {
  pulse: 'Pulse',
  elevate: 'Elevate',
  hyperspeed: 'Hyperspeed',
};

export function ExperienceCard({ experience, onSelect }: ExperienceCardProps) {
  const intensity = intensityMap[experience.intensity_level] || experience.intensity_level;

  return (
    <article className="relative overflow-hidden rounded-[32px] border border-white/8 bg-black/60 shadow-[0_25px_60px_rgba(5,5,10,0.7)]">
      {experience.image_url && (
        <div className="absolute inset-0 opacity-40 transition group-hover:opacity-60">
          <img src={experience.image_url} alt={experience.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-6 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-slate-300">{intensity}</p>
            <h3 className="mt-2 text-2xl font-black">{experience.name}</h3>
          </div>
          <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-amber-200">
            {experience.price_range}
          </span>
        </div>

        <p className="text-sm text-slate-200">{experience.description}</p>

        <dl className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <MapPin className="h-4 w-4 text-sky-300" />
              Track
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{experience.location}</p>
            <p className="text-[11px] text-slate-400">{experience.track_layout}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <AlarmClock className="h-4 w-4 text-amber-300" />
              Duration
            </div>
            <p className="mt-2 text-3xl font-black">{experience.duration_minutes}</p>
            <p className="text-[11px] text-slate-400">minutes</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Users className="h-4 w-4 text-fuchsia-300" />
              Grid
            </div>
            <p className="mt-2 text-2xl font-black">{experience.max_cars}</p>
            <p className="text-[11px] text-slate-400">cars max</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Activity className="h-4 w-4 text-lime-300" />
              Discipline
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{experience.intensity_level}</p>
          </div>
        </dl>

        <button
          onClick={() => onSelect?.(experience.id)}
          className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 px-6 py-3 text-xs font-black uppercase tracking-[0.4em] text-black transition hover:brightness-110"
        >
          Reserve slot
        </button>
      </div>
    </article>
  );
}
