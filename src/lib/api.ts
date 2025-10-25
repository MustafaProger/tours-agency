// src/lib/api.ts
class ApiClient {
  baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${response.status} ${text}`);
    }

    return response.json();
  }

  // --- API endpoints ---
  getGuides() {
    return this.request('/guides');
  }

  getTours() {
    return this.request('/tours');
  }

  getReviews(limit?: number) {
    const endpoint = limit ? `/reviews?limit=${limit}` : '/reviews';
    return this.request(endpoint);
  }

  getBookings() {
    return this.request('/bookings');
  }

  createBooking(booking: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }
}

// Экспортируем экземпляр
export const apiClient = new ApiClient();

// --- типы ---
export interface Guide {
  id: number;
  full_name: string;
  title: string;
  specialty_id: number;
  bio: string;
  education: string;
  experience_years: number;
  image_url: string;
  email: string;
  phone: string;
  languages: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: number;
  name: string;
  description: string;
  duration_days: number;
  price_range: string;
  destination: string;
  difficulty_level: string;
  max_participants: number;
  specialty_id: number;
  is_active: boolean;
  created_at: string;
}

export interface Review {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  tour_id: number;
  guide_id: number;
  is_approved: boolean;
  created_at: string;
}

export interface Booking {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  tour_id: number;
  guide_id: number;
  preferred_start_date: string;
  preferred_end_date: string;
  participants_count: number;
  notes: string;
  status: string;
  created_at: string;
}
