import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';

const BirdsTestConfig = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    questionType: 'audio_visual',
    optionsType: 'multiple_choice',
    guessType: 'common_name',
    timingType: 'unlimited',
    timeLimit: 30
  });

  const handleStart = () => {
    navigate('/birds/test/play', { state: { config } });
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/birds')}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Birds</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 animate-fade-in">
            Configure Your Test
          </h1>
          <p className="text-lg text-gray-600">
            Customize your quiz settings before starting
          </p>
        </div>

        <div className="card p-8 space-y-8">
          {/* Question Type */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">1. Question Type</h3>
            <div className="space-y-3">
              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="questionType"
                  value="audio_visual"
                  checked={config.questionType === 'audio_visual'}
                  onChange={(e) => updateConfig('questionType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Audio + Visual</div>
                  <div className="text-sm text-gray-600">
                    Picture displayed with audio playback option
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="questionType"
                  value="visual_only"
                  checked={config.questionType === 'visual_only'}
                  onChange={(e) => updateConfig('questionType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Visual Only</div>
                  <div className="text-sm text-gray-600">
                    Only picture is displayed
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="questionType"
                  value="audio_only"
                  checked={config.questionType === 'audio_only'}
                  onChange={(e) => updateConfig('questionType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Audio Only</div>
                  <div className="text-sm text-gray-600">
                    Only audio clip of bird call is presented
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Options Type */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">2. Answer Format</h3>
            <div className="space-y-3">
              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="optionsType"
                  value="multiple_choice"
                  checked={config.optionsType === 'multiple_choice'}
                  onChange={(e) => updateConfig('optionsType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Multiple Choice (4 options)</div>
                  <div className="text-sm text-gray-600">
                    Choose from 4 possible answers
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="optionsType"
                  value="text_dropdown"
                  checked={config.optionsType === 'text_dropdown'}
                  onChange={(e) => updateConfig('optionsType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Text Input with Dropdown</div>
                  <div className="text-sm text-gray-600">
                    Type the answer with autocomplete suggestions
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="optionsType"
                  value="text_strict"
                  checked={config.optionsType === 'text_strict'}
                  onChange={(e) => updateConfig('optionsType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Text Input (Strict)</div>
                  <div className="text-sm text-gray-600">
                    Type the exact answer - no autocomplete or hints
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Guess Type */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">3. What to Identify</h3>
            <div className="space-y-3">
              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="guessType"
                  value="common_name"
                  checked={config.guessType === 'common_name'}
                  onChange={(e) => updateConfig('guessType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Common Name</div>
                  <div className="text-sm text-gray-600">
                    Identify birds by their common name (e.g., "Red-tailed Hawk")
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="guessType"
                  value="scientific_name"
                  checked={config.guessType === 'scientific_name'}
                  onChange={(e) => updateConfig('guessType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Scientific Name</div>
                  <div className="text-sm text-gray-600">
                    Identify birds by their scientific name (e.g., "Buteo jamaicensis")
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Timing Type */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. Time Constraint</h3>
            <div className="space-y-3">
              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="timingType"
                  value="unlimited"
                  checked={config.timingType === 'unlimited'}
                  onChange={(e) => updateConfig('timingType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800">Unlimited Time</div>
                  <div className="text-sm text-gray-600">
                    Take as much time as you need for each question
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="timingType"
                  value="timed"
                  checked={config.timingType === 'timed'}
                  onChange={(e) => updateConfig('timingType', e.target.value)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 mb-2">Time Limited</div>
                  <div className="text-sm text-gray-600 mb-3">
                    Set a time limit for each question
                  </div>
                  {config.timingType === 'timed' && (
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="10"
                        value={config.timeLimit}
                        onChange={(e) => updateConfig('timeLimit', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="font-semibold text-blue-600 min-w-[80px]">
                        {config.timeLimit} seconds
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleStart}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center space-x-3"
            >
              <Play className="w-6 h-6" />
              <span>Start Test</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BirdsTestConfig;
