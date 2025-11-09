import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Birds from './pages/Birds';
import BirdsLearn from './pages/BirdsLearn';
import BirdsTestConfig from './pages/BirdsTestConfig';
import BirdsTestPlay from './pages/BirdsTestPlay';
import BirdsTestResults from './pages/BirdsTestResults';
import GameHistory from './pages/GameHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Birds Routes */}
          <Route
            path="/birds"
            element={
              <ProtectedRoute>
                <Birds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/birds/learn"
            element={
              <ProtectedRoute>
                <BirdsLearn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/birds/test"
            element={
              <ProtectedRoute>
                <BirdsTestConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/birds/test/play"
            element={
              <ProtectedRoute>
                <BirdsTestPlay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/birds/test/results"
            element={
              <ProtectedRoute>
                <BirdsTestResults />
              </ProtectedRoute>
            }
          />

          {/* History */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <GameHistory />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home if logged in, otherwise to login */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
