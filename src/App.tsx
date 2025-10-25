// App.tsx — тёмная тема по умолчанию
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TourGuideCard } from './components/TourGuideCard';
import { TourCard } from './components/TourCard';
import { ReviewCard } from './components/ReviewCard';
import { BookingModal } from './components/BookingModal';
import { apiClient, type Guide, type Tour, type Review } from './lib/api';
import { Users, Briefcase, MessageCircle } from 'lucide-react';

function App() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  // DARK: включаем тёмный режим на документе
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    console.log('Загрузка данных из JSON Server...');
    try {
      const [guidesData, toursData, reviewsData] = await Promise.all([
        apiClient.getGuides(),
        apiClient.getTours(),
        apiClient.getReviews(6),
      ]);
      setGuides(guidesData);
      setTours(toursData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTour = (guideId?: number) => {
    setSelectedGuideId(guideId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-300 text-lg">Загрузка…</p>
        </div>
      </div>
    );
  }

  return (
    // DARK: базовый тёмный фон и светлый текст
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <Header onBookTour={() => handleBookTour()} />
      <Hero onBookTour={() => handleBookTour()} />

      {/* Гиды */}
      <section id="guides" className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-900/30 text-blue-300 px-4 py-2 rounded-full mb-4 ring-1 ring-blue-800/50">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Наша команда</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Познакомьтесь с нашими экспертами-гидами
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Наша опытная команда организует персональные приключения,
              учитывая ваши интересы и предпочтения.
            </p>
          </div>

          {guides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">
                Сейчас гидов нет. Загляните позже.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <TourGuideCard
                  key={guide.id}
                  guide={guide}
                  onSelectGuide={handleBookTour}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Туры */}
      <section id="tours" className="py-16 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-900/30 text-emerald-300 px-4 py-2 rounded-full mb-4 ring-1 ring-emerald-800/50">
              <Briefcase className="w-5 h-5" />
              <span className="font-semibold">Наши туры</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Потрясающие приключенческие туры
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              От восхождений в горы до культурных экспедиций — у нас полный
              спектр туров на любой вкус.
            </p>
          </div>

          {tours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">
                Информация о турах скоро появится.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Отзывы */}
      <section id="reviews" className="py-16 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-900/30 text-amber-300 px-4 py-2 rounded-full mb-4 ring-1 ring-amber-800/50">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Отзывы клиентов</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Что говорят наши клиенты
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Читайте впечатления тех, кто уже отправился с нами
              в незабываемые приключения.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">
                Будьте первыми, кто поделится впечатлениями!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Подвал */}
      <footer className="bg-neutral-950 text-neutral-200 py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Приключенческие туры</h3>
            <p className="text-neutral-400 mb-6">
              Совершенство в путешествиях — создаём незабываемые приключения
            </p>
            <button
              onClick={() => handleBookTour()}
              className="bg-gradient-to-tr from-sky-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Начните путешествие уже сегодня
            </button>
          </div>
        </div>
      </footer>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGuideId(undefined);
        }}
        selectedGuideId={selectedGuideId}
      />
    </div>
  );
}

export default App;