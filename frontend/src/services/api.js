import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`
});

// Ajoute automatiquement le token JWT à chaque requête
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Workouts
export const getWorkouts = () => API.get('/workouts');
export const createWorkout = (data) => API.post('/workouts', data);
export const deleteWorkout = (id) => API.delete(`/workouts/${id}`);

// Meals
export const getMeals = (date) => API.get(`/meals${date ? `?date=${date}` : ''}`);
export const createMeal = (data) => API.post('/meals', data);
export const deleteMeal = (id) => API.delete(`/meals/${id}`);
export const getMealHistory = (page) => API.get(`/meals/history?page=${page}&limit=5`);

// Exercises
export const getExercises = (params) => API.get('/exercises', { params });

// Dashboard 
export const getDashboard = () => API.get('/dashboard');

// Profile
export const getStats = () => API.get('/users/stats');
export const updateUsername = (data) => API.put('/users/username', data);
export const updatePassword = (data) => API.put('/users/password', data);

// CalorieGoal
export const updateCalorieGoal = (data) => API.put('/users/calorie-goal', data);