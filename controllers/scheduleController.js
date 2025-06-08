const { getStudentByCardNumber } = require('../models/studentModel');
const {
  getScheduleForGroupByWeek,
  getScheduleForGroupByDate,
} = require('../models/scheduleModel');

function getWeekRange(date = new Date()) {
  const start = new Date(date);
  start.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // Пн — начало недели
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Вс — конец недели
  return { start, end };
}

async function getWeeklySchedule(req, res) {
  try {
    const student = await getStudentByCardNumber(req.user.cardNumber);
    if (!student) return res.status(404).json({ message: 'Студент не найден' });

    const { start, end } = getWeekRange();
    const schedule = await getScheduleForGroupByWeek(student.group_id, start, end);

    res.json({ schedule });
  } catch (err) {
    console.error('Weekly schedule error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

async function getTodaySchedule(req, res) {
  try {
    const student = await getStudentByCardNumber(req.user.cardNumber);
    if (!student) return res.status(404).json({ message: 'Студент не найден' });

    const today = new Date().toISOString().split('T')[0];
    const schedule = await getScheduleForGroupByDate(student.group_id, today);

    res.json({ schedule });
  } catch (err) {
    console.error('Today schedule error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = {
  getWeeklySchedule,
  getTodaySchedule,
};
