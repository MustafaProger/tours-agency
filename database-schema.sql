-- SuperCar Experience - database schema & seed data

-- 1. Disciplines catalog (hypercar / GT / track day)
CREATE TABLE IF NOT EXISTS disciplines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE
);

-- 2. Drivers / instructors
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    discipline_id INTEGER REFERENCES disciplines(id) ON DELETE SET NULL,
    bio TEXT,
    certifications TEXT,
    experience_years INTEGER,
    hero_car VARCHAR(255),
    image_url VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(40),
    languages VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Experiences / driving programs
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    track_layout VARCHAR(255),
    intensity_level VARCHAR(50),
    duration_minutes INTEGER,
    price_range VARCHAR(120),
    location VARCHAR(255),
    max_cars INTEGER,
    discipline_id INTEGER REFERENCES disciplines(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Reviews (table name differs to highlight a new domain)
CREATE TABLE IF NOT EXISTS thrill_reviews (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    experience_id INTEGER REFERENCES experiences(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bookings (track sessions)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(30) NOT NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    experience_id INTEGER REFERENCES experiences(id) ON DELETE SET NULL,
    preferred_track_date DATE NOT NULL,
    preferred_track_time VARCHAR(40) NOT NULL,
    participants_count INTEGER DEFAULT 1,
    notes TEXT,
    status VARCHAR(40) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_drivers_active ON drivers(is_active);
CREATE INDEX IF NOT EXISTS idx_experiences_active ON experiences(is_active);
CREATE INDEX IF NOT EXISTS idx_thrill_reviews ON thrill_reviews(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Seed data ---------------------------------------------------------------
INSERT INTO disciplines (name) VALUES
    ('Hypercar'),
    ('Track day'),
    ('GT endurance')
ON CONFLICT DO NOTHING;

INSERT INTO drivers (full_name, title, discipline_id, bio, certifications, experience_years, hero_car, image_url, email, phone, languages)
VALUES
    ('Maya Koval', 'Lead Pace Pilot', (SELECT id FROM disciplines WHERE name = 'Hypercar'),
     'Бывший тест-пилот Pagani и инструктор по скоростной езде. Специализируется на настройке аэродинамики и launch control.',
     'FIA Professional Instructor, AMG Driving Academy', 11, 'Pagani Utopia',
     'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
     'maya@supercar.club', '+1 (702) 555-0191', 'English, Italian'),
    ('Kenji Arata', 'Carbon Track Architect', (SELECT id FROM disciplines WHERE name = 'Track day'),
     'Идеальные траектории Suzuka / Fuji Speedway, ведёт night laps и обучает работе с углом атаки.',
     'FIA Silver, Drift Masters', 9, 'Nissan GT-R Nismo',
     'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
     'kenji@supercar.club', '+81 90 7777 8888', 'English, Japanese'),
    ('Lena Duarte', 'Thermal Management Coach', (SELECT id FROM disciplines WHERE name = 'GT endurance'),
     'Пилот endurance-серий: фокус на стратегии пит-стопов и стабильном темпе 40+ минут.',
     'Le Mans Driver Academy, McLaren P1 Program', 13, 'McLaren 765LT',
     'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
     'lena@supercar.club', '+34 611 203 987', 'English, Spanish, Portuguese'),
    ('Noah Richter', 'EV Hyperdrive Lead', (SELECT id FROM disciplines WHERE name = 'Hypercar'),
     'Ведущий инженер-пилот Rimac, отвечает за torque vectoring и высоковольтные системы.',
     'Rimac Development Program, EV Safety', 7, 'Rimac Nevera',
     'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
     'noah@supercar.club', '+49 170 555 1122', 'English, German')
ON CONFLICT DO NOTHING;

INSERT INTO experiences (name, description, track_layout, intensity_level, duration_minutes, price_range, location, max_cars, discipline_id, image_url)
VALUES
  ('Midnight GT Sprint', 'Поздняя сессия с пустой трассой: точные торможения, контроль exit speed и холодный асфальт.', 'Yas Marina North Circuit', 'hyperspeed', 45, '$1,250 / session', 'Abu Dhabi', 6, (SELECT id FROM disciplines WHERE name = 'Track day'),
   'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80'),
  ('Apex Sculpting Lab', 'Телеметрия, анализ линий и работа с жёсткими настройками подвески.', 'Circuit de Spa, sector 2', 'elevate', 60, '$980 / lab', 'Spa-Francorchamps', 4, (SELECT id FROM disciplines WHERE name = 'GT endurance'),
   'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80'),
  ('Carbon Drift Ritual', 'Слайды, перекладки и управление углом при 140+ км/ч.', 'Fuji Speedway infield', 'pulse', 50, '$790 / ritual', 'Shizuoka', 5, (SELECT id FROM disciplines WHERE name = 'Track day'),
   'https://images.unsplash.com/photo-1503736334956-4dffa62713c8?auto=format&fit=crop&w=1400&q=80'),
  ('Hyper EV Launch', 'Режим 0-200-0, управление рекуперацией и синхронизация крутящего момента.', 'Rimac Proving Ground', 'hyperspeed', 35, '$1,450 / cycle', 'Zagreb', 3, (SELECT id FROM disciplines WHERE name = 'Hypercar'),
   'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80'),
  ('Endurance Thermal Flow', 'Сессия при 32,°C: мониторинг температур и контроль деградации шин.', 'Bahrain International', 'elevate', 70, '$1,050 / block', 'Sakhir', 5, (SELECT id FROM disciplines WHERE name = 'GT endurance'),
   'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80'),
  ('City Neon Chase', 'Ночной прогон по перекрытым улицам, синхронные колонны и световые сценарии.', 'Private Downtown Loop', 'pulse', 40, '$900 / chase', 'Singapore', 8, (SELECT id FROM disciplines WHERE name = 'Hypercar'),
   'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80');

INSERT INTO thrill_reviews (client_name, rating, comment, experience_id, driver_id, is_approved)
VALUES
  ('Artyom Voss', 5, 'Midnight GT Sprint - чистый адреналин. Maya помогла снять ещё 1.2 секунды с круга.', 1, 1, true),
  ('Sofia Mendes', 5, 'Apex Sculpting Lab полностью поменял мою линию в Eau Rouge. Детальный разбор телеметрии.', 2, 3, true),
  ('Luca Weiss', 4, 'Carbon Drift Ritual подарил лучший контроль сноса. Хотелось бы больше кругов на мокром покрытии.', 3, 2, true),
  ('Nadia Rahman', 5, 'Hyper EV Launch с Ноа - другой уровень понимания EV. Теперь знаю потолок рекуперации.', 4, 4, true),
  ('Felix Anders', 5, 'Endurance Thermal Flow помог стабилизировать темп на жаре. Лучший воркшоп по охлаждению шин.', 5, 3, true),
  ('Kai Matsuda', 5, 'City Neon Chase - кинематографичный опыт. Колонны движутся как в фильме.', 6, 2, true);

INSERT INTO bookings (client_name, client_email, client_phone, driver_id, experience_id, preferred_track_date, preferred_track_time, participants_count, notes, status)
VALUES
  ('Roman Steele', 'roman@synthdrive.io', '+1 (415) 555-7710', 1, 1, CURRENT_DATE + INTERVAL '5 day', '23:30', 1, 'Нужен onboard с телеметрией.', 'pending'),
  ('Ivy Hsu', 'ivy@neonshift.studio', '+65 8333 2299', 2, 6, CURRENT_DATE + INTERVAL '12 day', '01:00', 3, 'Хотим синхронизировать дроны, требуется координация.', 'confirmed');
