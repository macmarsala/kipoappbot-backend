### 📁 **Backend — API для Личного кабинета студента**

# Личный кабинет студента — Backend (REST API)

Это серверная часть дипломного проекта — REST API для Telegram WebApp «Личный кабинет студента» для АНПОО «Кубанский ИПО».

## ⚙️ Основной стек

- **Node.js + Express**
- **PostgreSQL** — реляционная база данных
- **JWT** — авторизация
- **bcrypt** — хэширование паролей
- **dotenv** — переменные окружения
- **cookie-parser** — безопасная работа с httpOnly куки

## 🧩 Архитектура

Проект построен по REST-принципам. Все модули разделены по назначению:

- `routes/` — маршруты API
- `controllers/` — логика обработки запросов
- `services/` — бизнес-логика
- `middlewares/` — валидация, авторизация
- `models/` — взаимодействие с базой
- `db/` — инициализация и подключение PostgreSQL

## 📌 Основные функции

- Вход по зачетке + пароль
- Telegram авторизация через `initData`
- Привязка и отвязка Telegram ID
- Получение расписания на сегодня и неделю
- Получение профиля авторизованного студента

## 📂 Структура базы данных

- `students`
- `groups`
- `schedule`
- `lessons`
- и другие вспомогательные таблицы

## 🚀 Запуск проекта

```bash
git clone https://github.com/macmarsala/kipoappbot-backend.git
cd kipoappbot-backend
npm install
# Создайте файл .env и заполните PORT, DATABASE_URL, JWT_SECRET, TELEGRAM_BOT_TOKEN
npm run dev
