const client = require('./db');
const fs = require('fs');
const path = require('path');

async function initDb() {
  try {
    await client.connect();
    
    await executeSqlFile('create-enums.sql');
    await executeSqlFile('create-tables.sql');
    await executeSqlFile('create-indexes.sql');

    console.log('База данных успешно инициализирована');
  } catch (err) {
    console.error('Ошибка при инициализации БД:', err);
  } finally {
    await client.end();
  }
}

async function executeSqlFile(filename) {
  const filePath = path.join(__dirname, 'sql', filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
}

initDb();
