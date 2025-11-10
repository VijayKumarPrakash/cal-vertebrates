import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Home, RotateCcw, CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import { saveGame, getLeaderboard } from '../api';

const BirdsTestResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { config, answers, score, totalQuestions, totalTime } = location.state || {};

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [saving, setSaving] = useState(true);

  // Prevent duplicate saves in React StrictMode
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!config || !answers) {
      navigate('/birds/test');
      return;
    }

    // Only save once
    if (!hasSaved.current) {
      hasSaved.current = true;
      saveGameAndFetchLeaderboard();
    }
  }, []);

  const saveGameAndFetchLeaderboard = async () => {
    try {
      // Save game
      const gameData = {
        user_id: user.id,
        category: 'birds',
        question_type: config.questionType,
        options_type: config.optionsType,
        guess_type: config.guessType,
        timing_type: config.timingType,
        time_limit: config.timingType === 'timed' ? config.timeLimit : null,
        score: score,
        total_questions: totalQuestions,
        time_taken: totalTime,
        answers: answers
      };

      await saveGame(gameData);

      // Fetch leaderboard
      const leaderboardData = await getLeaderboard(
        {
          category: 'birds',
          question_type: config.questionType,
          options_type: config.optionsType,
          guess_type: config.guessType,
          timing_type: config.timingType
        },
        user.id
      );

      setLeaderboard(leaderboardData.leaderboard);
      setUserRank(leaderboardData.userRank);
      setTotalPlayers(leaderboardData.totalPlayers);
      setSaving(false);
    } catch (err) {
      console.error('Error saving game:', err);
      setSaving(false);
    }
  };

  const getScorePercentage = () => {
    return Math.round((score / totalQuestions) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
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

  if (!config || !answers) {
    return null;
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl opacity-90">Here are your results</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Score Summary */}
        <div className="card p-8 mb-8 text-center">
          <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
            {score} / {totalQuestions}
          </div>
          <div className="text-2xl text-gray-600 mb-6">
            {getScorePercentage()}% Correct
          </div>
          <div className="flex items-center justify-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Total Time: {formatTime(totalTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Avg: {formatTime(Math.round(totalTime / totalQuestions))}/question</span>
            </div>
          </div>
        </div>

        {/* Game Settings Summary */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Test Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Question Type:</span>
              <div className="font-semibold capitalize">
                {config.questionType.replace('_', ' ')}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Answer Format:</span>
              <div className="font-semibold capitalize">
                {config.optionsType.replace('_', ' ')}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Identify:</span>
              <div className="font-semibold capitalize">
                {config.guessType.replace('_', ' ')}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Timing:</span>
              <div className="font-semibold capitalize">
                {config.timingType === 'timed' ? `${config.timeLimit}s/question` : 'Unlimited'}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Leaderboard</span>
          </h3>

          {saving ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Player</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboard.map((entry, index) => {
                      const isCurrentUser = entry.user_id === user.id;
                      const actualRank = entry.rank;

                      return (
                        <tr
                          key={entry.id}
                          className={`${
                            isCurrentUser ? 'bg-blue-50 font-semibold' : ''
                          } ${index > 8 && index < leaderboard.length - 1 ? 'hidden' : ''}`}
                        >
                          {index === 9 && leaderboard.length > 10 && (
                            <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                              ...
                            </td>
                          )}
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              {actualRank <= 3 && (
                                <Trophy className={`w-5 h-5 ${
                                  actualRank === 1 ? 'text-yellow-500' :
                                  actualRank === 2 ? 'text-gray-400' :
                                  'text-orange-600'
                                }`} />
                              )}
                              <span>#{actualRank}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {entry.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">You</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {entry.score}/{entry.total_questions}
                            <span className="text-gray-500 text-sm ml-1">
                              ({Math.round((entry.score / entry.total_questions) * 100)}%)
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatTime(entry.time_taken)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(entry.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPlayers > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  {userRank && (
                    <p>
                      Your rank: <strong>#{userRank}</strong> out of {totalPlayers} player{totalPlayers !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Detailed Answers */}
        <div className="card p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Detailed Results</h3>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  answer.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {answer.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold text-gray-800">
                        Question {index + 1}
                      </span>
                    </div>
                    <div className="ml-7 space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Your answer:</span>
                        <span className={`ml-2 font-medium ${
                          answer.is_correct ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {answer.user_answer || '(No answer)'}
                        </span>
                      </div>
                      {!answer.is_correct && (
                        <div>
                          <span className="text-gray-600">Correct answer:</span>
                          <span className="ml-2 font-medium text-green-700">
                            {answer.correct_answer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(answer.time_taken)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/birds/test')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Test</span>
          </button>
          <button
            onClick={() => navigate('/home')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default BirdsTestResults;
