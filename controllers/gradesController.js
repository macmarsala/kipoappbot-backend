const { getStudentByCardNumber } = require('../models/studentModel');
const { getGradesByStudentId } = require('../models/gradesModel');

/**
 * Получить все оценки студента (по токену)
 */
async function getStudentGrades(req, res) {
  try {
    const student = await getStudentByCardNumber(req.user.cardNumber);
    if (!student) {
      return res.status(404).json({ message: 'Студент не найден' });
    }

    const grades = await getGradesByStudentId(student.id);
    res.json({ grades });
  } catch (err) {
    console.error('Ошибка при получении оценок:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = {
  getStudentGrades,
};
