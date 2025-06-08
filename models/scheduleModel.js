const db = require('../db');

// Получить расписание на неделю по дате начала (например, с понедельника текущей недели)
async function getScheduleForGroupByWeek(groupId, startDate, endDate) {
  const res = await db.query(
    `SELECT s.id, s.lesson_date, s.lesson_number, s.teacher, s.classroom, s.lesson_type,
            sub.name AS subject
     FROM schedule s
     JOIN subjects sub ON s.subject_id = sub.id
     WHERE s.group_id = $1 AND s.lesson_date BETWEEN $2 AND $3
     ORDER BY s.lesson_date, s.lesson_number`,
    [groupId, startDate, endDate]
  );
  return res.rows;
}

// Получить расписание на конкретную дату
async function getScheduleForGroupByDate(groupId, date) {
  const res = await db.query(
    `SELECT s.id, s.lesson_date, s.lesson_number, s.teacher, s.classroom, s.lesson_type,
            sub.name AS subject
     FROM schedule s
     JOIN subjects sub ON s.subject_id = sub.id
     WHERE s.group_id = $1 AND s.lesson_date = $2
     ORDER BY s.lesson_number`,
    [groupId, date]
  );
  return res.rows;
}

module.exports = {
  getScheduleForGroupByWeek,
  getScheduleForGroupByDate,
};
