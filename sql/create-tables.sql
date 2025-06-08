CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL,
  curator_name TEXT,
  curator_phone TEXT
);

CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  card_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  telegram_id BIGINT
);

CREATE TABLE IF NOT EXISTS schedule (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  lesson_date DATE NOT NULL,
  lesson_number INTEGER NOT NULL,
  teacher TEXT,
  classroom TEXT,
  lesson_type lesson_type_enum NOT NULL
);

CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  grade_type grade_type_enum NOT NULL,
  grade grade_value_enum NOT NULL,
  date DATE,
  
  CONSTRAINT grade_type_check CHECK (
    (grade_type IN ('Экзамен', 'Дифзачет') AND grade IN ('2', '3', '4', '5')) OR
    (grade_type = 'Зачет' AND grade IN ('Зачет', 'Незачет'))
  )
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,  -- Может быть NULL для общих документов
  subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,  -- Может быть NULL
  title TEXT NOT NULL,
  category doc_category_enum NOT NULL,
  url TEXT NOT NULL,
  
  -- Проверки в зависимости от категории
  CONSTRAINT doc_validation_check CHECK (
    (category = 'Учебный план' AND group_id IS NOT NULL AND subject_id IS NULL) OR
    (category IN ('Методичка', 'Вопросы') AND group_id IS NOT NULL AND subject_id IS NOT NULL) OR
    (category = 'Общий документ' AND group_id IS NULL AND subject_id IS NULL)
  ),
  
  -- Уникальность URL в рамках группы/предмета
  CONSTRAINT unique_url_per_context UNIQUE (group_id, subject_id, url)
);