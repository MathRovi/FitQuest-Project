const Workout = require('../models/Workout');
const User = require('../models/User');

const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let newStreak = user.streak || 0;

  if (!user.lastActive) {
    newStreak = 1;
  } else {
    const last = new Date(user.lastActive);
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const diffMs = today.getTime() - lastDay.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return newStreak;
    } else if (diffDays === 1) {
      newStreak = (user.streak || 0) + 1;
    } else {
      newStreak = 1;
    }
  }

  await User.findByIdAndUpdate(userId, {
    streak: newStreak,
    lastActive: now
  });

  return newStreak;
};

const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId);
  const workoutCount = await Workout.countDocuments({ user: userId });
  const badges = [...(user.badges || [])];

  if (workoutCount >= 1 && !badges.includes('First Workout')) {
    badges.push('First Workout');
  }
  if (workoutCount >= 10 && !badges.includes('Fitness Beginner')) {
    badges.push('Fitness Beginner');
  }
  if (workoutCount >= 50 && !badges.includes('Consistency Champion')) {
    badges.push('Consistency Champion');
  }
  if (user.streak >= 7 && !badges.includes('7 Day Streak')) {
    badges.push('7 Day Streak');
    await User.findByIdAndUpdate(userId, { $inc: { xp: 50 } });
  }

  const updatedUser = await User.findById(userId);
  const level = Math.floor((updatedUser.xp || 0) / 100) + 1;

  await User.findByIdAndUpdate(userId, { badges, level });
};

exports.createWorkout = async (req, res) => {
  try {
    const { name, type, duration, caloriesBurned, exercises } = req.body;

    const workout = await Workout.create({
      user: req.userId,
      name, type, duration, caloriesBurned, exercises
    });

    await User.findByIdAndUpdate(req.userId, { $inc: { xp: 20 } });

    await updateStreak(req.userId);

    await checkAndAwardBadges(req.userId);

    res.status(201).json({ message: 'Workout ajouté ! +20 XP', workout });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const { type, startDate, endDate, search } = req.query;
    let filter = { user: req.userId };

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    let workouts = await Workout.find(filter).sort({ date: -1 });

    if (search) {
      workouts = workouts.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.userId });
    if (!workout) return res.status(404).json({ message: 'Workout non trouvé' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!workout) return res.status(404).json({ message: 'Workout non trouvé' });
    res.json({ message: 'Workout mis à jour', workout });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!workout) return res.status(404).json({ message: 'Workout non trouvé' });
    res.json({ message: 'Workout supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};