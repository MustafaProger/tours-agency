import { Button } from '../ui/ui';
import { Sparkles, Play, MapPin } from 'lucide-react';

interface HeroProps {
  onBookExperience: () => void;
}

const stats = [
  { label: 'Track km logged', value: '42,300' },
  { label: 'Launches executed', value: '6,512' },
  { label: 'Average thrill score', value: '9.8/10' },
];

export function Hero({ onBookExperience }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#05050a] py-20 text-white sm:py-28">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,60,60,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,178,255,0.18),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-30" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.5em] text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Hyperdrive division
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Orchestrate your next <span className="text-transparent bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 bg-clip-text">supercar sequence</span>
          </h1>
          <p className="text-lg text-slate-300">
            Подготовленные инструкторы, ночные трассы и телеметрия в реальном времени. Мы создаём программы, в которых
            каждая миллисекунда — произведение искусства.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="px-8 py-4 text-sm uppercase tracking-[0.3em]" onClick={onBookExperience}>
              <Sparkles className="h-5 w-5" />
              Initiate session
            </Button>
            <button
              onClick={onBookExperience}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/20 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200 hover:border-white/40"
            >
              <Play className="h-4 w-4" />
              Watch telemetry
            </button>
          </div>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <dt className="text-xs uppercase tracking-[0.4em] text-slate-400">{stat.label}</dt>
                <dd className="mt-2 text-2xl font-black">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-x-6 top-6 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-400">
            <span>Night telemetry</span>
            <span className="flex items-center gap-2 text-amber-300">
              <MapPin className="h-4 w-4" />
              Yas Marina
            </span>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,211,77,0.25),transparent_55%)]" />
          <img
            src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80"
            alt="Supercar drifting at night"
            className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] rounded-[26px] object-cover opacity-80"
          />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Live parameters</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm font-semibold">
              <div>
                <p className="text-slate-400">Launch G</p>
                <p className="text-amber-300">1.44</p>
              </div>
              <div>
                <p className="text-slate-400">Temp °C</p>
                <p>32.1</p>
              </div>
              <div>
                <p className="text-slate-400">Boost bar</p>
                <p>2.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
