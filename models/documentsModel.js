const db = require('../db');

/**
 * Получение всех документов для конкретной группы и/или предмета
 * @param {number|null} groupId - ID группы (или null)
 * @param {number|null} subjectId - ID предмета (или null)
 */
async function getDocuments(groupId = null, subjectId = null) {
  const query = `
    SELECT d.id, d.title, d.category, d.url,
           g.name AS group_name,
           s.name AS subject_name
    FROM documents d
    LEFT JOIN groups g ON d.group_id = g.id
    LEFT JOIN subjects s ON d.subject_id = s.id
    WHERE ($1::int IS NULL OR d.group_id = $1)
      AND ($2::int IS NULL OR d.subject_id = $2)
    ORDER BY d.category, d.title
  `;
  const res = await db.query(query, [groupId, subjectId]);
  return res.rows;
}

module.exports = {
  getDocuments,
};
