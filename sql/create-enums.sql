-- Типы занятий
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lesson_type_enum') THEN
    CREATE TYPE lesson_type_enum AS ENUM ('Лекция', 'Консультация', 'Дифзачет', 'Экзамен');
  END IF;
END
$$;

-- Типы оценивания (формат контроля)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grade_type_enum') THEN
    CREATE TYPE grade_type_enum AS ENUM ('Экзамен', 'Дифзачет', 'Зачет');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'doc_category_enum') THEN
    CREATE TYPE doc_category_enum AS ENUM (
      'Учебный план',  -- Только для группы (без предмета)
      'Методичка',     -- Требует привязки к предмету
      'Вопросы',       -- Требует привязки к предмету
      'Общий документ' -- Не привязан ни к группе, ни к предмету
    );
  END IF;
END
$$;

-- Типы оценок (значения)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grade_value_enum') THEN
    CREATE TYPE grade_value_enum AS ENUM (
      '2', '3', '4', '5',  -- Числовые оценки
      'Зачет', 'Незачет'    -- Зачетные значения
    );
  END IF;
END
$$;