const jwt = require("jsonwebtoken");
const axios = require("axios");
const { verifyTelegramInitData } = require("../utils/telegram");
const {
  getStudentByTelegramId,
  createStudentByTelegram,
  unlinkTelegramId,
  getStudentByCardNumber,
  linkTelegramId,
  verifyPassword,
} = require("../models/studentModel");

// Настройки cookies с параметром maxAge в миллисекундах
const cookieSettings = (maxAge) => ({
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge,
});

// Универсальная установка cookies с токенами
function setAuthCookies(res, tokens) {
  return res
    .cookie("accessToken", tokens.accessToken, cookieSettings(15 * 60 * 1000)) // 15 минут
    .cookie("refreshToken", tokens.refreshToken, cookieSettings(7 * 24 * 60 * 60 * 1000)); // 7 дней
}

// Генерация JWT токенов
function generateTokens(payload) {
  return {
    accessToken: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }),
    refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }),
  };
}

// Общая логика аутентификации студента и установка куки
async function handleStudentAuth(res, student, telegramId = null) {
  if (telegramId && student.telegram_id !== telegramId) {
    await linkTelegramId(student.id, telegramId);
    student.telegram_id = telegramId;
  }

  const tokens = generateTokens({
    id: student.id,
    cardNumber: student.card_number,
    telegramId: telegramId || student.telegram_id,
  });

  return setAuthCookies(res, tokens).json({ message: "Успешная аутентификация", student });
}

async function telegramLogin(req, res) {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ message: "Отсутствует initData" });
  }

  try {
    // Проверяем подпись и парсим initData
    const telegramUser = verifyTelegramInitData(initData);
    const telegramId = telegramUser?.id;

    if (!telegramId) {
      return res.status(400).json({ message: "Некорректные данные Telegram" });
    }

    // Ищем студента, у которого привязан telegram_id = telegramId
    const student = await getStudentByTelegramId(telegramId);

    if (!student) {
      // Если не найден — говорим, что аккаунт не привязан
      return res.status(403).json({ message: "Telegram не привязан ни к одному аккаунту" });
    }

    // Авторизуем студента, выдаём JWT и куки
    return handleStudentAuth(res, student);
  } catch (err) {
    console.error("Ошибка Telegram авторизации:", err);
    return res.status(403).json({ message: "Невалидный initData" });
  }
}


// Проверка существования пользователя Telegram через API Telegram (не используется в контроллере, но оставлена для справки)
async function checkTelegramUserExists(telegramId) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const res = await axios.get(`https://api.telegram.org/bot${botToken}/getChat`, {
      params: { chat_id: telegramId },
    });
    return res.data.ok; // true, если пользователь существует
  } catch {
    return false; // пользователь не найден или ошибка
  }
}

// Вход по номеру зачетки и паролю с привязкой Telegram ID
async function signin(req, res) {
  const { cardNumber, password, telegram_id } = req.body;

  if (!cardNumber || !password) {
    return res.status(400).json({ message: "Номер зачетки и пароль обязательны" });
  }

  try {
    const student = await getStudentByCardNumber(cardNumber);
    if (!student) {
      return res.status(404).json({ message: "Студент не найден" });
    }

    const passwordValid = await verifyPassword(student, password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    if (telegram_id) {
      // Проверяем, не занят ли telegram_id другим студентом
      const studentWithTelegram = await getStudentByTelegramId(telegram_id);

      if (studentWithTelegram && studentWithTelegram.id !== student.id) {
        return res.status(403).json({ message: "Этот Telegram аккаунт уже привязан к другому студенту" });
      }

      if (student.telegram_id !== telegram_id) {
        await linkTelegramId(student.id, telegram_id);
        student.telegram_id = telegram_id;
      }
    }

    return handleStudentAuth(res, student, student.telegram_id);
  } catch (err) {
    console.error("Ошибка при входе:", err);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}

// Выход из аккаунта — отвязка Telegram ID и очистка куки
async function telegramLogout(req, res) {
  try {
    // req.user.id — это ID студента (не telegramId)
    await unlinkTelegramId(req.user.id);

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ message: "Вы вышли из аккаунта. Telegram ID отвязан." });
  } catch (err) {
    console.error("Ошибка выхода:", err);
    return res.status(500).json({ message: "Ошибка сервера при выходе" });
  }
}

// Получение информации о текущем пользователе
async function getMe(req, res) {
  const cardNumber = req.user?.cardNumber;

  if (!cardNumber) {
    return res.status(401).json({ message: "Неавторизован" });
  }

  try {
    const student = await getStudentByCardNumber(cardNumber);
    if (!student) {
      return res.status(404).json({ message: "Студент не найден" });
    }

    return res.json({ student });
  } catch (err) {
    console.error("Ошибка при получении данных студента:", err);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
}

module.exports = {
  getMe,
  signin,
  telegramLogin,
  telegramLogout,
};

