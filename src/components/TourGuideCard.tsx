import { Mail, Phone, GraduationCap, Award, Globe } from 'lucide-react';
import type { Guide } from '../lib/api';

interface TourGuideCardProps {
  guide: Guide;
  onSelectGuide: (guideId: number) => void;
}

export function TourGuideCard({ guide, onSelectGuide }: TourGuideCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        {guide.image_url ? (
          <img
            src={guide.image_url}
            alt={guide.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {guide.full_name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{guide.full_name}</h3>
        <p className="text-blue-600 font-semibold mb-2">{guide.title}</p>
        {guide.languages && (
          <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
            <Globe className="w-4 h-4" />
            Languages: {guide.languages}
          </p>
        )}

        <p className="text-gray-700 mb-4 line-clamp-3">{guide.bio}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="line-clamp-1">{guide.education || 'Education details available upon request'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="w-4 h-4 text-blue-600" />
            <span>{guide.experience_years} years of experience</span>
          </div>
        </div>

        <div className="space-y-2 mb-4 pt-4 border-t">
          {guide.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-blue-600" />
              <a href={`mailto:${guide.email}`} className="hover:text-blue-600 transition-colors">
                {guide.email}
              </a>
            </div>
          )}
          {guide.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-blue-600" />
              <a href={`tel:${guide.phone}`} className="hover:text-blue-600 transition-colors">
                {guide.phone}
              </a>
            </div>
          )}
        </div>

        <button
          onClick={() => onSelectGuide(guide.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          Book with Guide
        </button>
      </div>
    </div>
  );
}
