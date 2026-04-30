const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createMeal, getMeals, getMealHistory, deleteMeal } = require('../controllers/mealController');

router.use(auth);
router.post('/', createMeal);
router.get('/', getMeals);
router.get('/history', getMealHistory);
router.delete('/:id', deleteMeal);

module.exports = router;