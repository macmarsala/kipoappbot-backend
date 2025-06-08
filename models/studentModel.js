const db = require("../db");
const bcrypt = require("bcrypt");

// Поиск студента по номеру зачетки
async function getStudentByCardNumber(cardNumber) {
  const res = await db.query("SELECT * FROM students WHERE card_number = $1", [cardNumber]);
  return res.rows[0];
}

// Проверка пароля (хранимый пароль должен быть захеширован)
async function verifyPassword(student, password) {
  if (!student || !student.password_hash) return false;
  return await bcrypt.compare(password, student.password_hash);
}

// Привязка Telegram ID к студенту
async function linkTelegramId(studentId, telegramId) {
  await db.query("UPDATE students SET telegram_id = $1 WHERE id = $2", [telegramId, studentId]);
}

// Поиск по Telegram ID
async function getStudentByTelegramId(telegramId) {
  const res = await db.query("SELECT * FROM students WHERE telegram_id = $1", [telegramId]);
  return res.rows[0];
}

// Создание нового студента по данным Telegram
async function createStudentByTelegram({ id, username, full_name }) {
  const res = await db.query(
    `INSERT INTO students (telegram_id, full_name, card_number)
     VALUES ($1, $2, NULL)
     RETURNING *`,
    [id, full_name || username || `TelegramUser_${id}`]
  );
  return res.rows[0];
}

// Отвязка Telegram ID
async function unlinkTelegramId(studentId) {
  await db.query("UPDATE students SET telegram_id = NULL WHERE id = $1", [studentId]);
}

async function getStudentProfileByCardNumber(cardNumber) {
  const query = `
    SELECT 
      s.id, s.card_number, s.full_name, s.phone,
      g.name AS group_name,
      g.curator_name,
      g.curator_phone
    FROM students s
    LEFT JOIN groups g ON s.group_id = g.id
    WHERE s.card_number = $1
  `;

  const { rows } = await db.query(query, [cardNumber]);
  return rows[0];
}

module.exports = {
  getStudentByCardNumber,
  verifyPassword,
  linkTelegramId,
  getStudentByTelegramId,
  createStudentByTelegram,
  unlinkTelegramId,
  getStudentProfileByCardNumber,
};
