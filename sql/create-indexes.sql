CREATE INDEX IF NOT EXISTS idx_students_card_number ON students(card_number);
CREATE INDEX IF NOT EXISTS idx_schedule_group_date ON schedule(group_id, lesson_date);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_documents_group ON documents(group_id);