const db = require('../db');

/**
 * Получить все оценки студента по его ID
 * @param {number} studentId
 */
async function getGradesByStudentId(studentId) {
  const query = `
    SELECT 
      g.id,
      g.grade_type,
      g.grade,
      g.date,
      s.name AS subject_name
    FROM grades g
    JOIN subjects s ON g.subject_id = s.id
    WHERE g.student_id = $1
    ORDER BY g.date DESC NULLS LAST, s.name
  `;
  const res = await db.query(query, [studentId]);
  return res.rows;
}
  
module.exports = {
  getGradesByStudentId,
};
