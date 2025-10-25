// TourGuideCard.tsx — чистый, ровный вариант
import { Mail, Phone, GraduationCap, Award, Globe, MapPin } from "lucide-react";
import type { Guide } from "../lib/api";

interface TourGuideCardProps {
  guide: Guide;
  onSelectGuide: (guideId: number) => void;
}

export function TourGuideCard({ guide, onSelectGuide }: TourGuideCardProps) {
  return (
    <article
      className="
        rounded-2xl overflow-hidden
        bg-white/90 dark:bg-neutral-950/90
        ring-1 ring-neutral-200/70 dark:ring-neutral-800/70
        shadow-sm
      "
    >
      {/* Узкая плашка — не ломает радиусы (overflow-hidden решает) */}
      <div className="h-1.5 w-full bg-[linear-gradient(90deg,#2563EB,#7C3AED)]" />

      <div className="p-6">
        {/* Шапка */}
        <div className="flex items-start gap-4">
          {/* Аватар/инициал — без лишних теней */}
          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold text-neutral-700 dark:text-neutral-200 ring-1 ring-neutral-300/60 dark:ring-neutral-700/60">
            {guide.image_url ? (
              <img src={guide.image_url} alt={guide.full_name} className="h-full w-full object-cover" />
            ) : (
              <span>{guide.full_name?.charAt(0) ?? "G"}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white truncate">
              {guide.full_name}
            </h3>
            {guide.title && (
              <p className="text-indigo-700 dark:text-indigo-400 font-semibold">
                {guide.title}
              </p>
            )}
            {guide.location && (
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {guide.location}
              </p>
            )}
          </div>
        </div>

        {/* Языки — лёгкий чип */}
        {guide.languages && (
          <div className="mt-4">
            <span className="
              inline-flex items-center gap-1
              rounded-full px-2.5 py-1 text-xs font-medium
              ring-1 ring-neutral-200/70 dark:ring-neutral-800/70
              text-neutral-700 dark:text-neutral-200
              bg-white/60 dark:bg-neutral-900/40
            ">
              <Globe className="w-3.5 h-3.5" />
              Языки: {guide.languages}
            </span>
          </div>
        )}

        {/* Описание — компактная типографика */}
        {guide.bio && (
          <p className="mt-4 text-[15px] leading-6 text-neutral-700 dark:text-neutral-300">
            {guide.bio}
          </p>
        )}

        {/* Факты — ровная линия, без «плиток» */}
        <div className="
          mt-4 grid sm:grid-cols-2 gap-3 text-sm
          text-neutral-600 dark:text-neutral-400
        ">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="truncate">{guide.education || "Образование по запросу"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{guide.experience_years} лет опыта</span>
          </div>
        </div>

        {/* Контакты + CTA — единая высота, без тяжёлых теней */}
        <div className="
          mt-5 grid grid-cols-1 gap-2
          border-t border-neutral-200/70 dark:border-neutral-800/70 pt-4
        ">
          {guide.email ? (
            <a
              href={`mailto:${guide.email}`}
              className="
                group inline-flex items-center justify-start gap-2
                rounded-xl px-3 py-2.5
                text-sm font-medium
                ring-1 ring-inset ring-neutral-200/70 dark:ring-neutral-800/70
                text-neutral-700 dark:text-neutral-200
                hover:bg-white/70 dark:hover:bg-neutral-900/70 transition
              "
            >
              <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate">{guide.email}</span>
            </a>
          ) : <div className="hidden sm:block" />}

          {guide.phone ? (
            <a
              href={`tel:${guide.phone}`}
              className="
                group inline-flex items-center justify-start gap-2
                rounded-xl px-3 py-2.5
                text-sm font-medium
                ring-1 ring-inset ring-neutral-200/70 dark:ring-neutral-800/70
                text-neutral-700 dark:text-neutral-200
                hover:bg-white/70 dark:hover:bg-neutral-900/70 transition
              "
            >
              <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate">{guide.phone}</span>
            </a>
          ) : <div className="hidden sm:block" />}

          <button
            onClick={() => onSelectGuide(guide.id)}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl px-4 py-2.5 text-sm font-semibold text-white
              bg-[linear-gradient(135deg,#2563EB,#7C3AED)]
              hover:brightness-105 active:brightness-100 transition
            "
          >
            Забронировать у гида
          </button>
        </div>
      </div>
    </article>
  );
}