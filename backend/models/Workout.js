const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  type: { type: String, enum: ['cardio', 'strength', 'yoga', 'other'], default: 'other' },
  duration: { type: Number, required: true }, // en minutes
  caloriesBurned: { type: Number, default: 0 },
  exercises: [{ name: String, sets: Number, reps: Number }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);