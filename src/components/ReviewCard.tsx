import { Star } from 'lucide-react';
import type { Review } from '../lib/api';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < review.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
      <div className="border-t pt-4">
        <p className="font-semibold text-gray-900">{review.client_name}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
