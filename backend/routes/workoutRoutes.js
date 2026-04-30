const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createWorkout, getWorkouts,
  getWorkoutById, updateWorkout, deleteWorkout
} = require('../controllers/workoutController');

router.use(auth); // toutes les routes protégées
router.post('/', createWorkout);
router.get('/', getWorkouts);
router.get('/:id', getWorkoutById);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;