import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'ib-game.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Birds table
    db.run(`
      CREATE TABLE IF NOT EXISTS birds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        common_name TEXT NOT NULL,
        scientific_name TEXT NOT NULL,
        family TEXT,
        bird_order TEXT,
        description TEXT,
        image_url TEXT,
        audio_url TEXT,
        range_map_url TEXT,
        habitat TEXT,
        size TEXT,
        diet TEXT,
        conservation_status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Games table - stores each game session
    db.run(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        question_type TEXT NOT NULL,
        options_type TEXT NOT NULL,
        guess_type TEXT NOT NULL,
        timing_type TEXT NOT NULL,
        time_limit INTEGER,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        time_taken INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Game answers table - stores individual answers for each game
    db.run(`
      CREATE TABLE IF NOT EXISTS game_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL,
        bird_id INTEGER NOT NULL,
        user_answer TEXT,
        correct_answer TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        time_taken INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (bird_id) REFERENCES birds(id)
      )
    `);

    console.log('Database tables initialized');
  });
}

export default db;
