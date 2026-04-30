const Workout = require('../models/Workout');
const Meal = require('../models/Meal');
const User = require('../models/User');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    // Workouts des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentWorkouts = await Workout.find({
      user: userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    const recentMeals = await Meal.find({
      user: userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Construire les données pour les graphiques (7 derniers jours)
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      const dateStr = d.toISOString().split('T')[0];

      const dayWorkouts = recentWorkouts.filter(w =>
        new Date(w.date).toISOString().split('T')[0] === dateStr
      );
      const dayMeals = recentMeals.filter(m =>
        new Date(m.date).toISOString().split('T')[0] === dateStr
      );

      days.push({
        day: label,
        caloriesBurned: dayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
        caloriesEaten: dayMeals.reduce((s, m) => s + m.calories, 0),
        workouts: dayWorkouts.length
      });
    }

    const user = await User.findById(userId).select('-password');

    res.json({
      chartData: days,
      user,
      totalWorkouts: await Workout.countDocuments({ user: userId }),
      totalCaloriesBurned: recentWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};