## Руководство пользователя

### Требования
- Node.js 18+
- PostgreSQL (Neon). `.env` в корне:

```
DATABASE_URL=postgresql://user:pass@host/db
ADMIN_TOKEN=changeme
```

### Инициализация БД
1. `npm i`
2. `npm run db:init` (применит `database-schema.sql` с тестовыми данными)

### Запуск
- Бэкенд: `npm run server`
- Фронтенд: `npm run dev`
- Вместе: `npm start`

### API (CRUD)
- Публичные GET: `/health`, `/guides`, `/tours`, `/reviews`, `/bookings`
- Публичное создание брони: `POST /bookings` поля `client_name, client_email, client_phone, [tour_id], [guide_id], preferred_start_date, preferred_end_date, participants_count, notes`
- Админ (`Authorization: Bearer ADMIN_TOKEN`):
  - `POST/PUT/DELETE /guides/:id`
  - `POST/PUT/DELETE /tours/:id`
  - `PUT /reviews/approve/:id`
  - `PUT/DELETE /bookings/:id`

### Тестирование
- `npm run test:api` (ожидает запущенный сервер)

### Безопасность
- Редактирование только по админ-токену.
- Целостность: внешние ключи, индексы, ограничения.








