const Meal = require('../models/Meal');
const User = require('../models/User');

exports.createMeal = async (req, res) => {
  try {
    const { name, mealType, calories, protein, carbs } = req.body;

    const meal = await Meal.create({
      user: req.userId,
      name, mealType, calories, protein, carbs
    });

    await User.findByIdAndUpdate(req.userId, { $inc: { xp: 10 } });

    const updatedUser = await User.findById(req.userId);
    const level = Math.floor((updatedUser.xp || 0) / 100) + 1;
    await User.findByIdAndUpdate(req.userId, { level });

    res.status(201).json({ message: 'Repas ajouté ! +10 XP', meal });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getMeals = async (req, res) => {
  try {
    const { date } = req.query;
    let filter = { user: req.userId };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const meals = await Meal.find(filter).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Nouveau : historique paginé
exports.getMealHistory = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Récupère tous les repas groupés par date
    const meals = await Meal.find({ user: req.userId }).sort({ date: -1 });

    // Grouper par jour
    const grouped = {};
    meals.forEach(meal => {
      const dateKey = new Date(meal.date).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          meals: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
        };
      }
      grouped[dateKey].meals.push(meal);
      grouped[dateKey].totalCalories += meal.calories;
      grouped[dateKey].totalProtein += meal.protein;
      grouped[dateKey].totalCarbs += meal.carbs;
    });

    const days = Object.values(grouped).sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    // Pagination
    const total = days.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = days.slice((page - 1) * limit, page * limit);

    res.json({ days: paginated, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!meal) return res.status(404).json({ message: 'Repas non trouvé' });
    res.json({ message: 'Repas supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};