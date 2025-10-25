import { MapPin } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adventure Tours</h1>
              <p className="text-sm text-gray-600">Discover the World</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#guides" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Our Guides
            </a>
            <a href="#tours" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Tours
            </a>
            <a href="#reviews" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Reviews
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
