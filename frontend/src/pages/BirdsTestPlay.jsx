import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Clock, AlertCircle } from 'lucide-react';
import { getAllBirds } from '../api';

const BirdsTestPlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state?.config;

  const [birds, setBirds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!config) {
      navigate('/birds/test');
      return;
    }
    fetchBirdsAndSetupQuiz();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (config?.timingType === 'timed' && timeRemaining !== null) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitAnswer(true); // Auto-submit when time runs out
            return config.timeLimit;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [currentQuestionIndex, timeRemaining, config]);

  const fetchBirdsAndSetupQuiz = async () => {
    try {
      const response = await getAllBirds();
      const allBirds = response.birds;
      setBirds(allBirds);

      // Shuffle birds for random question order
      const shuffled = [...allBirds].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);

      if (config.timingType === 'timed') {
        setTimeRemaining(config.timeLimit);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching birds:', err);
      alert('Failed to load quiz');
      navigate('/birds/test');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const getCorrectAnswer = () => {
    return config.guessType === 'common_name'
      ? currentQuestion.common_name
      : currentQuestion.scientific_name;
  };

  // Memoize multiple choice options to prevent reshuffling on re-render
  const multipleChoiceOptions = useMemo(() => {
    if (config.optionsType !== 'multiple_choice' || !currentQuestion) {
      return [];
    }
    const correctAnswer = getCorrectAnswer();
    const otherBirds = birds
      .filter(b => b.id !== currentQuestion.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(b => config.guessType === 'common_name' ? b.common_name : b.scientific_name);

    const options = [correctAnswer, ...otherBirds].sort(() => Math.random() - 0.5);
    return options;
  }, [currentQuestionIndex, currentQuestion?.id, config.guessType, config.optionsType]);

  const handleInputChange = (value) => {
    setUserAnswer(value);

    if (config.optionsType === 'text_dropdown' && value.length > 0) {
      const matches = birds
        .map(b => config.guessType === 'common_name' ? b.common_name : b.scientific_name)
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUserAnswer(suggestion);
    setShowSuggestions(false);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setAudioPlaying(false);
  };

  const handleSubmitAnswer = (isTimeout = false) => {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const correctAnswer = getCorrectAnswer();
    const isCorrect = isTimeout ? false : userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    const answerData = {
      bird_id: currentQuestion.id,
      user_answer: isTimeout ? '(No answer - time expired)' : userAnswer,
      correct_answer: correctAnswer,
      is_correct: isCorrect,
      time_taken: timeTaken
    };

    setAnswers([...answers, answerData]);

    // Stop audio when moving to next question
    stopAudio();

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setQuestionStartTime(Date.now());
      if (config.timingType === 'timed') {
        setTimeRemaining(config.timeLimit);
      }
    } else {
      finishQuiz([...answers, answerData]);
    }
  };

  const finishQuiz = (finalAnswers) => {
    const score = finalAnswers.filter(a => a.is_correct).length;
    const totalTime = finalAnswers.reduce((sum, a) => sum + a.time_taken, 0);

    navigate('/birds/test/results', {
      state: {
        config,
        answers: finalAnswers,
        score,
        totalQuestions: questions.length,
        totalTime
      }
    });
  };

  const toggleAudio = () => {
    if (audioPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (currentQuestion?.audio_url) {
      // Stop any currently playing audio
      stopAudio();

      const audio = new Audio(currentQuestion.audio_url);
      audioRef.current = audio;
      setAudioPlaying(true);

      audio.play().catch(err => {
        console.error('Audio playback error:', err);
        setAudioPlaying(false);
      });

      audio.onended = () => {
        setAudioPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setAudioPlaying(false);
        audioRef.current = null;
        alert('Audio could not be played');
      };
    }
  };

  if (loading || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header with Timer */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-lg font-bold text-gray-900">
                Identify the {config.guessType === 'common_name' ? 'Common Name' : 'Scientific Name'}
              </div>
            </div>
            {config.timingType === 'timed' && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeRemaining <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xl">{timeRemaining}s</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          {/* Visual Question */}
          {(config.questionType === 'visual_only' || config.questionType === 'audio_visual') && (
            <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={currentQuestion.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt="Bird to identify"
                className="w-full h-[400px] object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available&fontSize=24';
                }}
              />
            </div>
          )}

          {/* Audio Question */}
          {(config.questionType === 'audio_only' || config.questionType === 'audio_visual') && (
            <div className="mb-6 text-center">
              <button
                onClick={toggleAudio}
                className={`btn-primary inline-flex items-center space-x-2 ${
                  audioPlaying ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
              >
                {audioPlaying ? (
                  <>
                    <VolumeX className="w-5 h-5 animate-pulse" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Play Bird Call</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Audio Only - Show placeholder */}
          {config.questionType === 'audio_only' && (
            <div className="mb-6 bg-gray-100 rounded-lg p-12 text-center">
              <Volume2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Listen to the bird call and identify the species</p>
            </div>
          )}

          {/* Answer Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Your Answer:
            </h3>

            {/* Multiple Choice */}
            {config.optionsType === 'multiple_choice' && (
              <div className="space-y-3">
                {multipleChoiceOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setUserAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      userAnswer === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Text Input (with or without dropdown) */}
            {(config.optionsType === 'text_dropdown' || config.optionsType === 'text_strict') && (
              <div className="relative">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => config.optionsType === 'text_dropdown' && userAnswer && setShowSuggestions(true)}
                  placeholder={`Enter ${config.guessType === 'common_name' ? 'common name' : 'scientific name'}...`}
                  className="input-field text-lg"
                  autoFocus
                />

                {/* Suggestions Dropdown */}
                {config.optionsType === 'text_dropdown' && showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={() => handleSubmitAnswer(false)}
              disabled={!userAnswer.trim()}
              className={`btn-primary w-full mt-6 text-lg py-4 ${
                !userAnswer.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>

            {/* Hint for strict mode */}
            {config.optionsType === 'text_strict' && (
              <div className="mt-4 flex items-start space-x-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Strict Mode:</strong> Spelling must be exact. Double-check your answer before submitting.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BirdsTestPlay;
