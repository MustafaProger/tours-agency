-- Tours Agency Database Schema
-- Таблица гидов (аналог doctors)
CREATE TABLE guides (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    specialty_id INTEGER,
    bio TEXT,
    education TEXT,
    experience_years INTEGER,
    image_url VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(20),
    languages VARCHAR(255), -- языки, которые знает гид
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица туров (аналог services)
CREATE TABLE tours (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INTEGER,
    price_range VARCHAR(100),
    destination VARCHAR(255),
    difficulty_level VARCHAR(50), -- easy, medium, hard
    max_participants INTEGER,
    specialty_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отзывов (аналог testimonials)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tour_id INTEGER,
    guide_id INTEGER,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица бронирований (аналог appointments)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    tour_id INTEGER,
    guide_id INTEGER,
    preferred_start_date DATE,
    preferred_end_date DATE,
    participants_count INTEGER DEFAULT 1,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тестовые данные для гидов
INSERT INTO guides (full_name, title, bio, education, experience_years, email, phone, languages) VALUES
('Анна Петрова', 'Senior Adventure Guide', 'Опытный гид с 8-летним стажем проведения горных походов и культурных туров. Специализируется на индивидуальных маршрутах.', 'Географический факультет МГУ, сертификат горного гида', 8, 'anna@tours.com', '+7-999-123-4567', 'Russian, English, French'),
('Михаил Соколов', 'Mountain Guide', 'Профессиональный горный гид с 12-летним опытом. Проводил экспедиции на Эльбрус, Казбек и другие вершины Кавказа.', 'Институт физкультуры и спорта, альпинистский сертификат', 12, 'mikhail@tours.com', '+7-999-234-5678', 'Russian, English, German'),
('Елена Волкова', 'Cultural Guide', 'Эксперт по истории и культуре России. Проводит экскурсии по Золотому кольцу и историческим местам Москвы.', 'Исторический факультет СПбГУ, курсы экскурсоводов', 6, 'elena@tours.com', '+7-999-345-6789', 'Russian, English, Italian'),
('Дмитрий Козлов', 'Wildlife Guide', 'Специалист по дикой природе и экотуризму. Организует сафари и наблюдения за животными в заповедниках.', 'Биологический факультет МГУ, сертификат экотуризма', 10, 'dmitry@tours.com', '+7-999-456-7890', 'Russian, English, Spanish');

-- Тестовые данные для туров
INSERT INTO tours (name, description, duration_days, price_range, destination, difficulty_level, max_participants) VALUES
('Поход по Кавказу', 'Незабываемое путешествие по горным тропам Кавказа с восхождением на Эльбрус. Включает проживание в горных приютах и питание.', 7, '$500-800', 'Кавказ, Россия', 'medium', 12),
('Культурный тур по Золотому кольцу', 'Изучение истории России через древние города: Суздаль, Владимир, Ярославль, Кострома. Посещение музеев и монастырей.', 5, '$300-500', 'Золотое кольцо, Россия', 'easy', 20),
('Сафари в Карелии', 'Экотуризм в дикой природе Карелии. Наблюдение за медведями, лосями и другими животными в их естественной среде обитания.', 4, '$400-600', 'Карелия, Россия', 'easy', 8),
('Горный треккинг на Алтае', 'Сложный горный маршрут по Алтайским горам с ночевками в палатках. Для опытных туристов.', 10, '$800-1200', 'Алтай, Россия', 'hard', 6),
('Речной круиз по Волге', 'Комфортный круиз по реке Волге с посещением исторических городов и природных достопримечательностей.', 8, '$600-900', 'Волга, Россия', 'easy', 50),
('Зимний тур в Сибири', 'Экстремальный зимний тур с собачьими упряжками, подледной рыбалкой и посещением традиционных деревень.', 6, '$700-1000', 'Сибирь, Россия', 'hard', 10);

-- Тестовые данные для отзывов
INSERT INTO reviews (client_name, rating, comment, tour_id, guide_id, is_approved) VALUES
('Елена Иванова', 5, 'Потрясающий тур! Гид Анна была очень профессиональной и внимательной. Маршрут был продуман до мелочей, виды просто невероятные. Обязательно поеду еще раз!', 1, 1, true),
('Дмитрий Козлов', 4, 'Отличная организация тура по Золотому кольцу. Елена рассказала много интересного об истории городов. Единственный минус - мало времени на самостоятельные прогулки.', 2, 3, true),
('Мария Смирнова', 5, 'Сафари в Карелии превзошло все ожидания! Дмитрий - настоящий профессионал, знает каждое животное в лесу. Увидели медведя с медвежатами - незабываемо!', 3, 4, true),
('Алексей Петров', 5, 'Сложный, но невероятно красивый маршрут по Алтаю. Михаил обеспечил безопасность и комфорт даже в самых сложных условиях. Рекомендую опытным туристам!', 4, 2, true),
('Ольга Васильева', 4, 'Круиз по Волге был очень комфортным и познавательным. Хорошая программа, вкусная еда, отличный сервис. Единственное - погода подвела.', 5, 3, true),
('Игорь Николаев', 5, 'Экстремальный зимний тур - это было нечто! Настоящее приключение с собачьими упряжками. Дмитрий создал атмосферу настоящего путешественника. Всем рекомендую!', 6, 4, true);
