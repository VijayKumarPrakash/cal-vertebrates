import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== AUTH ROUTES ====================

// Login/Register user (username only)
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (user) {
      // User exists, return user data
      return res.json({ user });
    }

    // Create new user
    db.run('INSERT INTO users (username) VALUES (?)', [username], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user' });
      }

      const newUser = {
        id: this.lastID,
        username: username,
        created_at: new Date().toISOString()
      };

      res.json({ user: newUser });
    });
  });
});

// ==================== BIRD ROUTES ====================

// Get all birds
app.get('/api/birds', (req, res) => {
  db.all('SELECT * FROM birds ORDER BY common_name', (err, birds) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ birds });
  });
});

// Get single bird by ID
app.get('/api/birds/:id', (req, res) => {
  db.get('SELECT * FROM birds WHERE id = ?', [req.params.id], (err, bird) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!bird) {
      return res.status(404).json({ error: 'Bird not found' });
    }
    res.json({ bird });
  });
});

// ==================== GAME ROUTES ====================

// Create a new game
app.post('/api/games', (req, res) => {
  const {
    user_id,
    category,
    question_type,
    options_type,
    guess_type,
    timing_type,
    time_limit,
    score,
    total_questions,
    time_taken,
    answers
  } = req.body;

  db.run(
    `INSERT INTO games (user_id, category, question_type, options_type, guess_type, timing_type, time_limit, score, total_questions, time_taken)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, category, question_type, options_type, guess_type, timing_type, time_limit, score, total_questions, time_taken],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save game' });
      }

      const gameId = this.lastID;

      // Insert answers if provided
      if (answers && answers.length > 0) {
        const stmt = db.prepare(
          'INSERT INTO game_answers (game_id, bird_id, user_answer, correct_answer, is_correct, time_taken) VALUES (?, ?, ?, ?, ?, ?)'
        );

        answers.forEach(answer => {
          stmt.run(
            gameId,
            answer.bird_id,
            answer.user_answer,
            answer.correct_answer,
            answer.is_correct ? 1 : 0,
            answer.time_taken
          );
        });

        stmt.finalize();
      }

      res.json({ gameId, message: 'Game saved successfully' });
    }
  );
});

// Get user's game history
app.get('/api/games/user/:userId', (req, res) => {
  db.all(
    `SELECT * FROM games WHERE user_id = ? ORDER BY created_at DESC`,
    [req.params.userId],
    (err, games) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ games });
    }
  );
});

// Get game details with answers
app.get('/api/games/:gameId/details', (req, res) => {
  db.get('SELECT * FROM games WHERE id = ?', [req.params.gameId], (err, game) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    db.all(
      `SELECT ga.*, b.common_name, b.scientific_name, b.image_url
       FROM game_answers ga
       JOIN birds b ON ga.bird_id = b.id
       WHERE ga.game_id = ?`,
      [req.params.gameId],
      (err, answers) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ game, answers });
      }
    );
  });
});

// Get leaderboard for specific game settings
app.get('/api/leaderboard', (req, res) => {
  const { category, question_type, options_type, guess_type, timing_type, user_id } = req.query;

  let query = `
    SELECT
      g.*,
      u.username,
      ROW_NUMBER() OVER (
        ORDER BY g.score DESC, g.time_taken ASC, g.created_at ASC
      ) as rank
    FROM games g
    JOIN users u ON g.user_id = u.id
    WHERE g.category = ?
      AND g.question_type = ?
      AND g.options_type = ?
      AND g.guess_type = ?
      AND g.timing_type = ?
  `;

  db.all(
    query,
    [category, question_type, options_type, guess_type, timing_type],
    (err, games) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Find user's rank
      const userGame = games.find(g => g.user_id == user_id);
      const userRank = userGame ? userGame.rank : null;

      let leaderboard = [];

      if (userRank && userRank <= 10) {
        // User is in top 10, show top 10
        leaderboard = games.slice(0, 10);
      } else if (userRank) {
        // User is not in top 10, show top 9 + user
        leaderboard = games.slice(0, 9);
        leaderboard.push(userGame);
      } else {
        // User hasn't played or show top 10
        leaderboard = games.slice(0, 10);
      }

      res.json({ leaderboard, userRank, totalPlayers: games.length });
    }
  );
});

// ==================== SEED DATA ROUTE ====================

// Add birds to database (for initial setup)
app.post('/api/birds/seed', (req, res) => {
  const { birds } = req.body;

  if (!birds || !Array.isArray(birds)) {
    return res.status(400).json({ error: 'Birds array is required' });
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO birds
    (common_name, scientific_name, family, bird_order, description, image_url, audio_url, range_map_url, habitat, size, diet, conservation_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  birds.forEach(bird => {
    stmt.run(
      bird.common_name,
      bird.scientific_name,
      bird.family,
      bird.order,
      bird.description,
      bird.image_url,
      bird.audio_url,
      bird.range_map_url,
      bird.habitat,
      bird.size,
      bird.diet,
      bird.conservation_status
    );
  });

  stmt.finalize((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to seed birds' });
    }
    res.json({ message: `Successfully added ${birds.length} birds` });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
