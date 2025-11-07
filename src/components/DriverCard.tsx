// TourGuideCard.tsx — чистый, ровный вариант
import { Mail, Phone, Award, Gauge, Languages, Clock } from 'lucide-react';
import type { Driver } from '../lib/api';

interface DriverCardProps {
  driver: Driver;
  onSelectDriver: (driverId: number) => void;
}

export function DriverCard({ driver, onSelectDriver }: DriverCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0d0d13] via-[#0c0c12] to-[#050507] p-6 text-white shadow-[0_25px_60px_rgba(5,5,10,0.65)]">
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,60,60,0.25),_transparent_60%)]" />
      </div>
      <div className="relative z-10 flex items-start gap-5">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {driver.image_url ? (
            <img src={driver.image_url} alt={driver.full_name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-black">
              {driver.full_name?.[0] ?? 'D'}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pilot</p>
          <h3 className="text-2xl font-black">{driver.full_name}</h3>
          <p className="text-sm text-fuchsia-300">{driver.title}</p>
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-300">{driver.bio}</p>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
        <div className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-white/5/10 p-3">
          <span className="flex items-center gap-2 text-[10px]">
            <Clock className="h-4 w-4 text-amber-300" />
            Years
          </span>
          <span className="text-lg font-black text-white">{driver.experience_years}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-white/5/10 p-3">
          <span className="flex items-center gap-2 text-[10px]">
            <Gauge className="h-4 w-4 text-sky-300" />
            Hero car
          </span>
          <span className="text-sm font-semibold text-white/90">{driver.hero_car || 'On request'}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-white/5/10 p-3 col-span-2">
          <span className="flex items-center gap-2 text-[10px]">
            <Award className="h-4 w-4 text-lime-300" />
            Certifications
          </span>
          <span className="text-sm font-medium text-slate-200">{driver.certifications || '—'}</span>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
        {driver.languages && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em]">
            <Languages className="h-3.5 w-3.5 text-amber-200" />
            {driver.languages}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-3 border-t border-white/5 pt-5 text-sm">
        <a href={`mailto:${driver.email}`} className="flex items-center gap-3 text-slate-100 hover:text-white">
          <Mail className="h-4 w-4 text-amber-300" />
          {driver.email}
        </a>
        <a href={`tel:${driver.phone}`} className="flex items-center gap-3 text-slate-100 hover:text-white">
          <Phone className="h-4 w-4 text-sky-300" />
          {driver.phone}
        </a>
        <button
          onClick={() => onSelectDriver(driver.id)}
          className="mt-2 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 px-6 py-3 text-xs font-black uppercase tracking-[0.4em] text-black transition hover:brightness-110"
        >
          Sync with pilot
        </button>
      </div>
    </article>
  );
}
