const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Récupérer le profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour username
exports.updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: 'Username trop court (min 3 caractères)' });
    }

    // Vérifier si le username est déjà pris
    const existing = await User.findOne({ username, _id: { $ne: req.userId } });
    if (existing) {
      return res.status(400).json({ message: 'Ce username est déjà utilisé' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username: username.trim() },
      { new: true }
    ).select('-password');

    res.json({ message: 'Username mis à jour !', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Nouveau mot de passe trop court (min 6 caractères)' });
    }

    const user = await User.findById(req.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(req.userId, { password: hashed });

    res.json({ message: 'Mot de passe mis à jour !' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Statistiques du profil
exports.getStats = async (req, res) => {
  try {
    const Workout = require('../models/Workout');
    const Meal = require('../models/Meal');

    const totalWorkouts = await Workout.countDocuments({ user: req.userId });
    const totalMeals = await Meal.countDocuments({ user: req.userId });

    const workouts = await Workout.find({ user: req.userId });
    const totalCaloriesBurned = workouts.reduce((s, w) => s + w.caloriesBurned, 0);
    const totalDuration = workouts.reduce((s, w) => s + w.duration, 0);

    const user = await User.findById(req.userId).select('-password');

    res.json({
      totalWorkouts,
      totalMeals,
      totalCaloriesBurned,
      totalDuration,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateCalorieGoal = async (req, res) => {
  try {
    const { calorieGoal } = req.body;

    if (!calorieGoal || calorieGoal < 500 || calorieGoal > 10000) {
      return res.status(400).json({
        message: 'Objectif invalide (entre 500 et 10000 kcal)'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { calorieGoal: Number(calorieGoal) },
      { new: true }
    ).select('-password');

    res.json({ message: 'Objectif mis à jour !', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};