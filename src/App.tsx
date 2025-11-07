import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DriverCard } from './components/DriverCard';
import { ExperienceCard } from './components/ExperienceCard';
import { ReviewCard } from './components/ReviewCard';
import { BookingModal } from './components/BookingModal';
import { apiClient, type Driver, type Experience, type Review } from './lib/api';
import { Sparkles, Flame } from 'lucide-react';

function App() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [driversData, experiencesData, reviewsData] = await Promise.all([
          apiClient.getDrivers(),
          apiClient.getExperiences(),
          apiClient.getReviews(6),
        ]);
        setDrivers(driversData);
        setExperiences(experiencesData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to load content', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleBook = (driverId?: number) => {
    setSelectedDriverId(driverId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030308]">
        <div className="text-center text-white">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
          <p className="text-sm uppercase tracking-[0.5em] text-slate-400">Booting telemetry…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030308] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,60,60,0.25),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,205,255,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
      </div>

      <div className="relative z-10">
        <Header onBookExperience={() => handleBook()} />
        <Hero onBookExperience={() => handleBook()} />

        <section id="drivers" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.5em] text-slate-300">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Pilots
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Curators of velocity</h2>
            <p className="mt-3 text-base text-slate-300">
              Топовые инструкторы hypercar сцен. Каждый держит телеметрию, свет и звук под полным контролем.
            </p>
          </div>
          {drivers.length === 0 ? (
            <p className="text-center text-slate-400">Пилоты ещё загружаются.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {drivers.map((driver) => (
                <DriverCard key={driver.id} driver={driver} onSelectDriver={(id) => handleBook(id)} />
              ))}
            </div>
          )}
        </section>

        <section id="experiences" className="bg-white/5 py-20 backdrop-blur-lg">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.5em] text-slate-300">
                <Flame className="h-4 w-4 text-fuchsia-300" />
                Programs
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight">Custom-built driving rituals</h2>
              <p className="mt-3 text-base text-slate-300">
                Ночные города, закрытые полигоны и гоночные лаборатории. Выбирайте интенсивность — мы соберём сетап.
              </p>
            </div>
            {experiences.length === 0 ? (
              <p className="text-center text-slate-400">Каталог программ обновляется.</p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {experiences.map((experience) => (
                  <ExperienceCard key={experience.id} experience={experience} onSelect={() => handleBook()} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.5em] text-slate-300">
              <Sparkles className="h-4 w-4 text-sky-300" />
              Feedback
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Client telemetry</h2>
            <p className="mt-3 text-base text-slate-300">Отзывы, собранные сразу после финишной прямой.</p>
          </div>
          {reviews.length === 0 ? (
            <p className="text-center text-slate-400">Пока нет опубликованных отзывов.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-white/10 bg-black/60">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 text-center sm:px-6 lg:px-8">
            <h3 className="text-3xl font-black tracking-[0.3em] text-white">SuperCar Experience</h3>
            <p className="text-sm text-slate-400">
              Мы проектируем эмоции, звучащие как карбон под нагрузкой. Приложение готово к деплою и подключению базы Neon.
            </p>
            <button
              onClick={() => handleBook()}
              className="mx-auto inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 px-8 py-4 text-xs font-black uppercase tracking-[0.4em] text-black transition hover:brightness-110"
            >
              Initiate booking
            </button>
          </div>
        </footer>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDriverId(undefined);
        }}
        selectedDriverId={selectedDriverId}
      />
    </div>
  );
}

export default App;
