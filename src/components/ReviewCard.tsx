// ReviewCard.tsx
import { Star } from "lucide-react";
import type { Review } from "../lib/api";
import { Card } from "../ui/ui";

interface ReviewCardProps { review: Review }

export function ReviewCard({ review }: ReviewCardProps) {
  const rating = Math.max(0, Math.min(5, review.rating));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-1 mb-3" aria-label={`Рейтинг: ${rating} из 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 dark:text-neutral-700"}`}
          />
        ))}
      </div>
      <p className="text-neutral-700 dark:text-neutral-300 italic mb-4">«{review.comment}»</p>
      <div className="border-t border-neutral-200/70 dark:border-neutral-800/70 pt-4">
        <p className="font-semibold text-neutral-900 dark:text-white">{review.client_name}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {new Date(review.created_at).toLocaleDateString("ru-RU")}
        </p>
      </div>
    </Card>
  );
}