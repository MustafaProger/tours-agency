import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient, type Guide, type Tour } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGuideId?: number;
}

export function BookingModal({ isOpen, onClose, selectedGuideId }: BookingModalProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    guide_id: selectedGuideId || '',
    tour_id: '',
    preferred_start_date: '',
    preferred_end_date: '',
    participants_count: 1,
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadGuidesAndTours();
      if (selectedGuideId) {
        setFormData(prev => ({ ...prev, guide_id: selectedGuideId }));
      }
    }
  }, [isOpen, selectedGuideId]);

  const loadGuidesAndTours = async () => {
    try {
      const [guidesData, toursData] = await Promise.all([
        apiClient.getGuides(),
        apiClient.getTours()
      ]);

      setGuides(guidesData);
      setTours(toursData);
    } catch (error) {
      console.error('Error loading guides and tours:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');

    try {
      await apiClient.createBooking({
        ...formData,
        guide_id: formData.guide_id || null,
        tour_id: formData.tour_id || null,
        status: 'pending'
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          guide_id: selectedGuideId || '',
          tour_id: '',
          preferred_start_date: '',
          preferred_end_date: '',
          participants_count: 1,
          notes: '',
        });
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Book Your Adventure</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Guide
            </label>
            <select
              value={formData.guide_id}
              onChange={(e) => setFormData({ ...formData, guide_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Available Guide</option>
              {guides.map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Tour
            </label>
            <select
              value={formData.tour_id}
              onChange={(e) => setFormData({ ...formData, tour_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">General Adventure</option>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.preferred_start_date}
                onChange={(e) => setFormData({ ...formData, preferred_start_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.preferred_end_date}
                onChange={(e) => setFormData({ ...formData, preferred_end_date: e.target.value })}
                min={formData.preferred_start_date || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Participants
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.participants_count}
              onChange={(e) => setFormData({ ...formData, participants_count: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any specific requirements or preferences..."
            />
          </div>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              Booking request submitted successfully! We'll contact you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              Failed to submit booking. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
