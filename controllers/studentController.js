const { getStudentProfileByCardNumber } = require('../models/studentModel');

async function getProfile(req, res) {
  const { cardNumber } = req.user;

  try {
    // Используем обновлённый запрос, который возвращает и группу, и куратора
    const student = await getStudentProfileByCardNumber(cardNumber);

    if (!student) {
      return res.status(404).json({ message: 'Студент не найден' });
    }

    res.json({
      id: student.id,
      cardNumber: student.card_number,
      fullName: student.full_name,
      phone: student.phone,
      group: student.group_name,        // название группы
      curatorName: student.curator_name,   // имя куратора
      curatorPhone: student.curator_phone, // телефон куратора
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = {
  getProfile,
};

