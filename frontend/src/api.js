import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Auth
export const login = async (username) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username });
  return response.data;
};

// Birds
export const getAllBirds = async () => {
  const response = await axios.get(`${API_URL}/birds`);
  return response.data;
};

export const getBirdById = async (id) => {
  const response = await axios.get(`${API_URL}/birds/${id}`);
  return response.data;
};

// Games
export const saveGame = async (gameData) => {
  const response = await axios.post(`${API_URL}/games`, gameData);
  return response.data;
};

export const getUserGames = async (userId) => {
  const response = await axios.get(`${API_URL}/games/user/${userId}`);
  return response.data;
};

export const getGameDetails = async (gameId) => {
  const response = await axios.get(`${API_URL}/games/${gameId}/details`);
  return response.data;
};

export const getLeaderboard = async (gameSettings, userId) => {
  const params = new URLSearchParams({
    ...gameSettings,
    user_id: userId
  });
  const response = await axios.get(`${API_URL}/leaderboard?${params}`);
  return response.data;
};
