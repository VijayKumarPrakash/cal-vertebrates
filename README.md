# IB Game - Vertebrate Natural History Learning Platform

Interactive gamified module to learn about California vertebrates. Created to assist the teaching team of UC Berkeley's Integrative Biology 104LF course.

## Features

### 🎓 Learning Mode
- Interactive flashcard-style presentations
- High-quality bird images from Wikipedia
- Audio clips of bird calls from Xeno-canto
- Detailed information including:
  - Scientific classification (Order, Family)
  - Habitat and range information
  - Size, diet, and conservation status
  - Comprehensive descriptions

### 🧠 Testing Mode
Highly customizable quiz experience with:

**Question Types:**
- Audio + Visual: Picture with audio playback
- Visual Only: Picture identification
- Audio Only: Bird call identification

**Answer Formats:**
- Multiple Choice (4 options)
- Text Input with Autocomplete
- Strict Text Input (no hints)

**Identification Options:**
- Common Name (e.g., "Red-tailed Hawk")
- Scientific Name (e.g., "Buteo jamaicensis")

**Timing Options:**
- Unlimited time
- Time-limited (10-120 seconds per question)

### 📊 Features
- **Leaderboard**: Compare your scores with others for specific game settings
- **Game History**: Track your progress and review past performances
- **Detailed Results**: See exactly which questions you got right or wrong
- **Real-time Statistics**: Average scores, best performances, and time tracking

### 🦅 Current Dataset
10 bird species including:
- Red-tailed Hawk
- Black-bellied Plover
- Least Sandpiper
- Glaucous-winged Gull
- Great Horned Owl
- American Robin
- Northern Cardinal
- Blue Jay
- Mallard
- American Crow

## Tech Stack

### Backend
- **Node.js** with Express
- **SQLite** database for data persistence
- **Axios** for API calls to fetch bird data
- Real data from:
  - Wikipedia (images and descriptions)
  - Xeno-canto (bird call audio)
  - GBIF (taxonomic information)

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database with bird data:
```bash
node seedBirdsCurated.js
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running the Application

1. **Start the backend** (in one terminal):
```bash
cd backend
npm run dev
```

2. **Start the frontend** (in another terminal):
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

4. **Login** with any username (no password required)

5. **Start learning or testing!**

## Project Structure

```
cal-vertebrates/
├── backend/
│   ├── database.js           # Database initialization and schema
│   ├── server.js             # Express server and API routes
│   ├── seedBirds.js          # Script to fetch bird data from APIs
│   ├── seedBirdsCurated.js   # Curated bird data seeding
│   ├── package.json
│   └── ib-game.db           # SQLite database (created after seeding)
│
├── frontend/
│   ├── src/
│   │   ├── api.js                      # API utility functions
│   │   ├── App.jsx                     # Main app with routing
│   │   ├── index.css                   # Global styles with Tailwind
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx         # Authentication context
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx      # Route protection component
│   │   └── pages/
│   │       ├── Login.jsx               # Login page
│   │       ├── Home.jsx                # Home page with category tiles
│   │       ├── Birds.jsx               # Birds category page
│   │       ├── BirdsLearn.jsx          # Flashcard learning mode
│   │       ├── BirdsTestConfig.jsx     # Quiz configuration
│   │       ├── BirdsTestPlay.jsx       # Active quiz page
│   │       ├── BirdsTestResults.jsx    # Results and leaderboard
│   │       └── GameHistory.jsx         # User's game history
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
└── README.md
```

## Database Schema

### Users
- `id`: Primary key
- `username`: Unique username
- `created_at`: Registration timestamp

### Birds
- `id`: Primary key
- `common_name`: Common name (e.g., "Red-tailed Hawk")
- `scientific_name`: Scientific name (e.g., "Buteo jamaicensis")
- `family`: Taxonomic family
- `bird_order`: Taxonomic order
- `description`: Detailed description
- `image_url`: Link to bird image
- `audio_url`: Link to bird call audio
- `range_map_url`: Link to range map
- `habitat`: Habitat information
- `size`: Size information
- `diet`: Diet information
- `conservation_status`: Conservation status

### Games
- `id`: Primary key
- `user_id`: Foreign key to users
- `category`: Category (e.g., "birds")
- `question_type`: Audio+Visual, Visual Only, or Audio Only
- `options_type`: Multiple Choice, Text with Dropdown, or Strict Text
- `guess_type`: Common Name or Scientific Name
- `timing_type`: Unlimited or Timed
- `time_limit`: Time limit in seconds (if timed)
- `score`: Number of correct answers
- `total_questions`: Total number of questions
- `time_taken`: Total time in seconds
- `created_at`: Game completion timestamp

### Game Answers
- `id`: Primary key
- `game_id`: Foreign key to games
- `bird_id`: Foreign key to birds
- `user_answer`: User's answer
- `correct_answer`: Correct answer
- `is_correct`: Boolean
- `time_taken`: Time taken for this question

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login or create user

### Birds
- `GET /api/birds` - Get all birds
- `GET /api/birds/:id` - Get single bird

### Games
- `POST /api/games` - Save a game
- `GET /api/games/user/:userId` - Get user's game history
- `GET /api/games/:gameId/details` - Get game details with answers
- `GET /api/leaderboard` - Get leaderboard for specific settings

## Future Enhancements

- **Mammals Section**: Add mammals with similar learning and testing features
- **Reptiles Section**: Add reptiles category
- **More Birds**: Expand bird database to include more species
- **Advanced Statistics**: More detailed analytics and progress tracking
- **Study Sets**: Allow users to create custom study sets
- **Spaced Repetition**: Implement spaced repetition algorithm for better learning
- **Mobile App**: React Native version for iOS and Android
- **Social Features**: Share scores, challenge friends
- **Achievements**: Badges and achievements for milestones

## Contributing

This project was created for UC Berkeley's IB 104LF course. Contributions to expand the dataset or add features are welcome!

## License

ISC

## Acknowledgments

- Bird data from Wikipedia, Xeno-canto, and GBIF
- UC Berkeley Integrative Biology Department
- All contributors to open ornithological databases
