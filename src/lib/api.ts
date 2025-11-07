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

  getDrivers(): Promise<Driver[]> {
    return this.request<Driver[]>('/drivers');
  }

  getExperiences(limit?: number): Promise<Experience[]> {
    const endpoint = limit ? `/experiences?limit=${limit}` : '/experiences';
    return this.request<Experience[]>(endpoint);
  }

  getReviews(limit?: number): Promise<Review[]> {
    const endpoint = limit ? `/reviews?limit=${limit}` : '/reviews';
    return this.request<Review[]>(endpoint);
  }

  getBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('/bookings');
  }

  createBooking(booking: CreateBookingDTO) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }
}

export const apiClient = new ApiClient();

export interface Driver {
  id: number;
  full_name: string;
  title: string;
  discipline_id: number | null;
  bio: string;
  certifications: string;
  experience_years: number;
  hero_car: string;
  image_url: string;
  email: string;
  phone: string;
  languages: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  name: string;
  description: string;
  track_layout: string;
  intensity_level: string;
  duration_minutes: number;
  price_range: string;
  location: string;
  max_cars: number;
  discipline_id: number | null;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface Review {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  experience_id: number | null;
  driver_id: number | null;
  is_approved: boolean;
  created_at: string;
}

export interface Booking {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  driver_id: number | null;
  experience_id: number | null;
  preferred_track_date: string;
  preferred_track_time: string;
  participants_count: number;
  notes: string;
  status: string;
  created_at: string;
}

export interface CreateBookingDTO {
  client_name: string;
  client_email: string;
  client_phone: string;
  driver_id: number | null;
  experience_id: number | null;
  preferred_track_date: string;
  preferred_track_time: string;
  participants_count: number;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'waitlist';
}
