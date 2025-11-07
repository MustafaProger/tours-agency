## ER-диаграмма (SuperCar Experience)

```mermaid
erDiagram
  DISCIPLINES ||--o{ DRIVERS : tags
  DISCIPLINES ||--o{ EXPERIENCES : groups
  DRIVERS ||--o{ THRILL_REVIEWS : mentioned
  EXPERIENCES ||--o{ THRILL_REVIEWS : rated
  DRIVERS ||--o{ BOOKINGS : assigned
  EXPERIENCES ||--o{ BOOKINGS : chosen

  DISCIPLINES {
    int id PK
    varchar name
  }
  DRIVERS {
    int id PK
    varchar full_name
    varchar title
    int discipline_id FK
    text bio
    text certifications
    int experience_years
    varchar hero_car
    varchar image_url
    varchar email
    varchar phone
    varchar languages
    bool is_active
    timestamptz created_at
    timestamptz updated_at
  }
  EXPERIENCES {
    int id PK
    varchar name
    text description
    varchar track_layout
    varchar intensity_level
    int duration_minutes
    varchar price_range
    varchar location
    int max_cars
    int discipline_id FK
    varchar image_url
    bool is_active
    timestamptz created_at
  }
  THRILL_REVIEWS {
    int id PK
    varchar client_name
    int rating
    text comment
    int experience_id FK
    int driver_id FK
    bool is_approved
    timestamptz created_at
  }
  BOOKINGS {
    int id PK
    varchar client_name
    varchar client_email
    varchar client_phone
    int driver_id FK
    int experience_id FK
    date preferred_track_date
    varchar preferred_track_time
    int participants_count
    text notes
    varchar status
    timestamptz created_at
  }
```

<<<<<<< HEAD
Нормализация: справочник SPECIALTIES исключает дублирование, остальные атрибуты зависят только от PK в своих таблицах — соблюдается 3НФ.








=======
Нормализация: справочник DISCIPLINES устраняет дубли направлений, остальные таблицы содержат только атрибуты, зависящие от своих PK → соблюдается 3НФ.
>>>>>>> origin/main
