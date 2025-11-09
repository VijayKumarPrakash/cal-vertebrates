import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, ArrowLeft } from 'lucide-react';

const Birds = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 animate-fade-in">
            Birds
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in">
            Learn about bird species or test your knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Learn Mode */}
          <button
            onClick={() => navigate('/birds/learn')}
            className="card p-10 text-center hover:scale-105 transition-all duration-300 animate-slide-up"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Learn</h2>
            <p className="text-gray-600 mb-4">
              Browse flashcards to learn about different bird species, their sounds, habitats, and characteristics
            </p>
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              Flashcard Mode
            </div>
          </button>

          {/* Test Mode */}
          <button
            onClick={() => navigate('/birds/test')}
            className="card p-10 text-center hover:scale-105 transition-all duration-300 animate-slide-up"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Test</h2>
            <p className="text-gray-600 mb-4">
              Challenge yourself with customizable quizzes to test your knowledge of bird identification
            </p>
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
              Quiz Mode
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-12 card bg-blue-50 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">About This Section</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Learn Mode:</strong> Study bird species through interactive flashcards featuring images, sounds, habitat information, and scientific details.
            </p>
            <p>
              <strong>Test Mode:</strong> Quiz yourself with customizable options including question type (visual, audio, or both), answer format (multiple choice or text input), and timing constraints.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Currently featuring 10 bird species relevant to UC Berkeley's IB 104LF course
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Birds;
