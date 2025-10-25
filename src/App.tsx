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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    console.log('Loading data from JSON Server...');

    try {
      const [guidesData, toursData, reviewsData] = await Promise.all([
        apiClient.getGuides(),
        apiClient.getTours(),
        apiClient.getReviews(6)
      ]);

      console.log('Guides data:', guidesData);
      console.log('Tours data:', toursData);
      console.log('Reviews data:', reviewsData);

      setGuides(guidesData);
      setTours(toursData);
      setReviews(reviewsData);

      console.log('Final state - Guides:', guidesData.length, 'Tours:', toursData.length, 'Reviews:', reviewsData.length);
    } catch (error) {
      console.error('Error loading data:', error);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero onBookTour={() => handleBookTour()} />

      <section id="guides" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Our Team</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Guides
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced team of travel professionals is committed to providing
              personalized adventures tailored to your unique interests.
            </p>
          </div>

          {guides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No guides available at the moment. Please check back soon.
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

      <section id="tours" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <Briefcase className="w-5 h-5" />
              <span className="font-semibold">Our Tours</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Amazing Adventure Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From mountain hiking to cultural exploration, we offer a full range
              of tours to satisfy every type of adventurer.
            </p>
          </div>

          {tours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Tour information will be available soon.
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

      <section id="reviews" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full mb-4">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Client Reviews</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read testimonials from our satisfied clients who have experienced
              unforgettable adventures with us.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Be the first to share your adventure experience with us!
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

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Adventure Tours</h3>
            <p className="text-gray-400 mb-6">
              Excellence in Travel - Creating Unforgettable Adventures
            </p>
            <button
              onClick={() => handleBookTour()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Your Adventure Today
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