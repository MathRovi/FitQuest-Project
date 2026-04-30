const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getProfile,
  updateUsername,
  updatePassword,
  getStats,
  updateCalorieGoal
} = require('../controllers/userController');

router.use(auth);
router.get('/profile', getProfile);
router.get('/stats', getStats);
router.put('/username', updateUsername);
router.put('/password', updatePassword);
router.put('/calorie-goal', updateCalorieGoal);

module.exports = router;