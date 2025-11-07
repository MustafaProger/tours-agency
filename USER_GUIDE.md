## Руководство пользователя — SuperCar Experience

### 1. Быстрый старт
1. Установите зависимости: `npm install`
2. Создайте `.env` и пропишите `DATABASE_URL`, `ADMIN_TOKEN`
3. Примените схему: `npm run db:init`
4. Запустите API: `npm run server`
5. Запустите UI: `npm run dev` (или `npm run start` для обоих процессов)

### 2. Как пользоваться
- **Pilots** — карточки инструкторов. Клик по `Sync with pilot` подставит пилота в форму
- **Programs** — карточки программ. Кнопка `Reserve slot` открывает модалку без предзаполнения
- **Client telemetry** — отзывы клиентов
- **Booking Modal** — заполните контакты, выберите дату/время трека, при необходимости выберите пилота и программу → нажмите `Запустить слот`

### 3. API
- Публичные GET: `/drivers`, `/experiences`, `/reviews`, `/bookings`, `/health`
- POST `/bookings` (валидируются имя, email, телефон, дата и время)
- Админские операции требуют `Authorization: Bearer ADMIN_TOKEN`:
  - `POST/PUT/DELETE /drivers/:id`
  - `POST/PUT/DELETE /experiences/:id`
  - `PUT /reviews/approve/:id`
  - `PUT/DELETE /bookings/:id`

### 4. Тесты
- `npm run test:api` — простая проверка доступности API и базовых коллекций

### 5. Безопасность и продакшн
- Не коммитьте `.env`
- Ограничьте CORS (в `server.js`) на ваш домен
- Храните `ADMIN_TOKEN` в секретах деплоя
- Используйте Neon roles/branching для продакшн-данных

### 6. Что настроить под себя
- **Контент**: обновите сиды в `database-schema.sql` (drivers/experiences/отзывы)
- **Брендинг**: правьте тексты в `src/App.tsx`, `components/*.tsx`
- **Цвета**: глобально в `src/index.css` и `src/ui/ui.tsx`

Так вы получите полнофункциональный SuperCar-портал с той же архитектурой, что и предыдущие проекты.
