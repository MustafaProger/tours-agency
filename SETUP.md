# ⚡️ Setup — SuperCar Experience

## 1. Системные требования
- Node.js 18+
- Доступ к базе PostgreSQL (Neon или локально)

## 2. Переменные окружения
Создайте `.env` в корне `SuperCar/`:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ADMIN_TOKEN=super-secret-token
PORT=3001
```
`ADMIN_TOKEN` нужен только для закрытых CRUD-операций.

## 3. Установка зависимостей
```bash
cd SuperCar
npm install
```

## 4. Подготовка БД
```bash
npm run db:init   # применяет database-schema.sql через Neon SQL
```
Команда создаёт таблицы `disciplines`, `drivers`, `experiences`, `thrill_reviews`, `bookings` и заполняет демо-данными (пилоты, программы, брони, отзывы).

## 5. Запуск
```bash
npm run server   # backend http://localhost:3001
npm run dev      # frontend http://localhost:5173
# или одним процессом
npm run start    # concurrently server + dev
```

## 6. Проверка
- `GET http://localhost:3001/health` → `{ ok: true, service: 'supercar-experience' }`
- `npm run test:api` — smoke-тесты (`tests/smoke.mjs`)

## 7. Что поменять под себя
- Обновите сид-данные в `database-schema.sql`
- Настройте цвета/графику в `src/components/*`
- Обновите `.env` с вашим URL Neon

После этого проект работает из коробки и повторяет всю функциональность предыдущих проектов, но в новой тематике.
