// Hero.tsx
import { Calendar } from "lucide-react";
import { Button } from "../ui/ui";

interface HeroProps { onBookTour: () => void }

export function Hero({ onBookTour }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-neutral-950">
      {/* тёмный нежный фон */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_0%_0%,rgba(59,130,246,0.10),transparent),radial-gradient(1200px_600px_at_100%_100%,rgba(124,58,237,0.10),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Ваше приключение ждёт
          </h1>
          <p className="text-lg md:text-2xl text-neutral-300 mb-10 max-w-3xl mx-auto">
            Исследуйте захватывающие направления с нашими гидами и создавайте незабываемые истории.
          </p>
          <Button className="px-8 py-4 text-lg" onClick={onBookTour}>
            <Calendar className="w-5 h-5" />
            Забронировать тур
          </Button>
        </div>
      </div>
    </section>
  );
}