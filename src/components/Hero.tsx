import { Calendar } from 'lucide-react';

interface HeroProps {
  onBookTour: () => void;
}

export function Hero({ onBookTour }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Adventure Awaits
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore breathtaking destinations with our expert guides and create
            unforgettable memories on your next adventure.
          </p>
          <button
            onClick={onBookTour}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            <Calendar className="w-5 h-5" />
            Book Your Adventure
          </button>
        </div>
      </div>
    </section>
  );
}
