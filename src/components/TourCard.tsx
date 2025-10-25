import { Clock, DollarSign, MapPin, Users } from 'lucide-react';
import type { Tour } from '../lib/api';

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 border-blue-600">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
      {tour.destination && (
        <p className="text-sm text-blue-600 font-semibold mb-3 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {tour.destination}
        </p>
      )}
      <p className="text-gray-700 mb-4">{tour.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>{tour.duration_days} days</span>
        </div>
        {tour.price_range && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>{tour.price_range}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Max {tour.max_participants}</span>
        </div>
      </div>
      {tour.difficulty_level && (
        <div className="mt-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            tour.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
            tour.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {tour.difficulty_level.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
