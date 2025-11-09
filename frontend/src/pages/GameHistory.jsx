import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Calendar, Clock, Trophy, Target } from 'lucide-react';
import { getUserGames } from '../api';

const GameHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async () => {
    try {
      const response = await getUserGames(user.id);
      setGames(response.games);
      setLoading(false);
    } catch (err) {
      setError('Failed to load game history');
      setLoading(false);
      console.error('Error fetching game history:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getScorePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800 border-green-300';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Game History</h1>
          <p className="text-gray-600 mt-2">View all your past quiz attempts and scores</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="card bg-red-50 border border-red-200 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {games.length === 0 ? (
          <div className="card p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Games Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't taken any quizzes yet. Start learning and testing your knowledge!
            </p>
            <button
              onClick={() => navigate('/home')}
              className="btn-primary"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{games.length}</div>
                <div className="text-sm text-gray-600">Total Games</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(
                    games.reduce((sum, g) => sum + (g.score / g.total_questions) * 100, 0) / games.length
                  )}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.max(...games.map(g => getScorePercentage(g.score, g.total_questions)))}%
                </div>
                <div className="text-sm text-gray-600">Best Score</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {formatTime(
                    Math.round(games.reduce((sum, g) => sum + g.time_taken, 0) / games.length)
                  )}
                </div>
                <div className="text-sm text-gray-600">Avg Time</div>
              </div>
            </div>

            {/* Games List */}
            <div className="space-y-4">
              {games.map((game) => {
                const percentage = getScorePercentage(game.score, game.total_questions);
                const scoreColorClass = getScoreColor(percentage);

                return (
                  <div key={game.id} className="card p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      {/* Game Info */}
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`px-3 py-1 rounded-full border-2 font-bold ${scoreColorClass}`}>
                            {game.score}/{game.total_questions} ({percentage}%)
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                            {game.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mt-3">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span className="capitalize">{game.question_type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="capitalize">{game.options_type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="capitalize">{game.guess_type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="capitalize">
                              {game.timing_type === 'timed' ? `${game.time_limit}s/q` : 'Unlimited'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-col space-y-2 text-sm text-gray-600 md:text-right">
                        <div className="flex items-center space-x-2 md:justify-end">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(game.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-2 md:justify-end">
                          <Clock className="w-4 h-4" />
                          <span>Total time: {formatTime(game.time_taken)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default GameHistory;
