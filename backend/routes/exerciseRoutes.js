const express = require('express');
const router = express.Router();
const exercises = require('../data/exercises');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET tous les exercices avec filtres optionnels
router.get('/', (req, res) => {
  const { muscle, difficulty, search } = req.query;
  let filtered = [...exercises];

  if (muscle && muscle !== 'all') {
    filtered = filtered.filter(e => e.muscle === muscle);
  }
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(e => e.difficulty === difficulty);
  }
  if (search) {
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({ total: filtered.length, exercises: filtered });
});

module.exports = router;