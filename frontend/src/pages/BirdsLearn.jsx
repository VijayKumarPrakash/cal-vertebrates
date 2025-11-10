import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, VolumeX, MapPin, Info } from 'lucide-react';
import { getAllBirds } from '../api';

const BirdsLearn = () => {
  const navigate = useNavigate();
  const [birds, setBirds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    fetchBirds();

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchBirds = async () => {
    try {
      const response = await getAllBirds();
      setBirds(response.birds);
      setLoading(false);
    } catch (err) {
      setError('Failed to load birds');
      setLoading(false);
      console.error('Error fetching birds:', err);
    }
  };

  const currentBird = birds[currentIndex];

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setAudioPlaying(false);
  };

  const handleNext = () => {
    if (currentIndex < birds.length - 1) {
      stopAudio();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      stopAudio();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleAudio = () => {
    if (audioPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (currentBird?.audio_url) {
      // Stop any currently playing audio
      stopAudio();

      const audio = new Audio(currentBird.audio_url);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading birds...</p>
        </div>
      </div>
    );
  }

  if (error || birds.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No birds found'}</p>
          <button onClick={() => navigate('/birds')} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Bird {currentIndex + 1} of {birds.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentIndex + 1) / birds.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / birds.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="card p-8 animate-fade-in">
          {/* Common Name */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            {currentBird.common_name}
          </h1>

          {/* Scientific Name */}
          <p className="text-xl text-gray-600 italic mb-6 text-center">
            {currentBird.scientific_name}
          </p>

          {/* Taxonomy */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Order: {currentBird.bird_order || 'N/A'}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Family: {currentBird.family || 'N/A'}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {currentBird.conservation_status || 'N/A'}
            </span>
          </div>

          {/* Image */}
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <img
              src={currentBird.image_url || 'https://via.placeholder.com/800x600?text=No+Image'}
              alt={currentBird.common_name}
              className="w-full h-[500px] object-contain"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available&fontSize=24';
              }}
            />
          </div>

          {/* Audio Button */}
          {currentBird.audio_url && (
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

          {/* Description */}
          {currentBird.description && (
            <div className="mb-6 bg-gray-50 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{currentBird.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Habitat */}
            {currentBird.habitat && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Habitat</h4>
                    <p className="text-gray-700 text-sm">{currentBird.habitat}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Size */}
            {currentBird.size && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Size</h4>
                  <p className="text-gray-700 text-sm">{currentBird.size}</p>
                </div>
              </div>
            )}

            {/* Diet */}
            {currentBird.diet && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Diet</h4>
                  <p className="text-gray-700 text-sm">{currentBird.diet}</p>
                </div>
              </div>
            )}

            {/* Range Map Link */}
            {currentBird.range_map_url && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Range Map</h4>
                  <a
                    href={currentBird.range_map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 text-sm underline"
                  >
                    View range map →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <span className="text-gray-600 font-medium">
              {currentIndex + 1} / {birds.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === birds.length - 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentIndex === birds.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BirdsLearn;
