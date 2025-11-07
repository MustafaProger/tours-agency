import { Star } from 'lucide-react';
import type { Review } from '../lib/api';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const rating = Math.max(0, Math.min(5, review.rating));

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0d0d13] to-[#050507] p-6 text-white shadow-[0_20px_50px_rgba(5,5,10,0.7)]">
      <div className="flex items-center gap-1" aria-label={`Rating ${rating} of 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < rating ? 'text-amber-300 fill-amber-300' : 'text-slate-600'}`}
          />
        ))}
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-100">“{review.comment}”</p>
      <div className="mt-auto border-t border-white/5 pt-4 text-sm text-slate-300">
        <p className="font-semibold tracking-[0.3em] uppercase">{review.client_name}</p>
        <p className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString('ru-RU')}</p>
      </div>
    </article>
  );
}
