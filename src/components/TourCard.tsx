// TourCard.tsx
import { Clock, DollarSign, MapPin, Users } from "lucide-react";
import type { Tour } from "../lib/api";
import { Card, Chip, Button, GhostButton } from "../ui/ui";

interface TourCardProps {
  tour: Tour;
  onSelect?: (tourId: number) => void;
}

export function TourCard({ tour, onSelect }: TourCardProps) {
  const diffMap: Record<string, { label: string; cls: string }> = {
    easy:   { label: "легкий",  cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-100" },
    medium: { label: "средний", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100" },
    hard:   { label: "сложный", cls: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-100" },
  };
  const diff = tour.difficulty_level && (diffMap[tour.difficulty_level] ?? { label: tour.difficulty_level, cls: "" });

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{tour.name}</h3>
        {diff && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${diff.cls}`}>Сложность: {diff.label}</span>}
      </div>

      {tour.destination && (
        <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {tour.destination}
        </p>
      )}

      <p className="mt-3 text-neutral-700 dark:text-neutral-300 line-clamp-4">{tour.description}</p>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-neutral-600 dark:text-neutral-400">
        <Chip><Clock className="w-4 h-4" /> {tour.duration_days} дн.</Chip>
        <Chip><Users className="w-4 h-4" /> Макс {tour.max_participants}</Chip>
        {tour.price_range && <Chip><DollarSign className="w-4 h-4" /> {tour.price_range}</Chip>}
      </div>

      <div className="mt-5 flex gap-3">
        <GhostButton>Подробнее</GhostButton>
        <Button onClick={() => onSelect?.(tour.id)}>Выбрать тур</Button>
      </div>
    </Card>
  );
}