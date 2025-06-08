const { getDocuments } = require("../models/documentsModel");
const { getStudentByCardNumber } = require("../models/studentModel");

async function getStudentDocuments(req, res) {
  try {
    const student = await getStudentByCardNumber(req.user.cardNumber);
    if (!student) {
      return res.status(404).json({ message: "Студент не найден" });
    }

    const groupId = student.group_id;

    const documents = await getDocuments(groupId, null);

    res.json({ documents });
  } catch (err) {
    console.error("Ошибка при получении документов:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

module.exports = {
  getStudentDocuments
};
