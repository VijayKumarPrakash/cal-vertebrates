import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bird, PawPrint, Fish, LogOut, Trophy, History } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = [
    {
      id: 'birds',
      title: 'Birds',
      icon: Bird,
      description: 'Learn about various bird species',
      available: true,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
    },
    {
      id: 'mammals',
      title: 'Mammals',
      icon: PawPrint,
      description: 'Explore mammal diversity',
      available: false,
      color: 'from-gray-400 to-gray-500',
      hoverColor: ''
    },
    {
      id: 'reptiles',
      title: 'Reptiles',
      icon: Fish,
      description: 'Discover reptile species',
      available: false,
      color: 'from-gray-400 to-gray-500',
      hoverColor: ''
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Bird className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IB Game</h1>
                <p className="text-sm text-gray-600">Vertebrate Natural History</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Welcome, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Choose a Category to Begin
          </h2>
          <p className="text-lg text-gray-600">
            Select a vertebrate group to learn and test your knowledge
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => category.available && navigate(`/${category.id}`)}
                disabled={!category.available}
                className={`card p-8 text-center transform transition-all duration-300 ${
                  category.available
                    ? 'cursor-pointer hover:scale-105 hover:shadow-2xl'
                    : 'opacity-60 cursor-not-allowed'
                } animate-fade-in`}
              >
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${category.color} ${category.hoverColor} flex items-center justify-center shadow-lg transition-all duration-300`}
                >
                  <IconComponent className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                {!category.available && (
                  <span className="inline-block px-4 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                    Coming Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/history')}
            className="card p-6 flex items-center space-x-4 hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-bold text-gray-800">Game History</h4>
              <p className="text-sm text-gray-600">View your past games and scores</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="card p-6 flex items-center space-x-4 hover:scale-105 transition-transform"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-bold text-gray-800">Leaderboard</h4>
              <p className="text-sm text-gray-600">See top performers</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
