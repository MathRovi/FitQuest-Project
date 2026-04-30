const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getDashboardData } = require('../controllers/dashboardController');

router.get('/', auth, getDashboardData);

module.exports = router;