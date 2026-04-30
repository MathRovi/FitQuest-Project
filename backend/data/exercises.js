const exercises = [
  // Chest
  { name: 'Bench Press', muscle: 'chest', difficulty: 'intermediate', description: 'Allongé sur un banc, pousse la barre vers le haut.' },
  { name: 'Push Up', muscle: 'chest', difficulty: 'beginner', description: 'Position planche, descends et remonte le corps.' },
  { name: 'Incline Bench Press', muscle: 'chest', difficulty: 'intermediate', description: 'Banc incliné, cible le haut du pectoral.' },
  { name: 'Chest Fly', muscle: 'chest', difficulty: 'beginner', description: 'Haltères, ouvre les bras en arc de cercle.' },
  { name: 'Dips', muscle: 'chest', difficulty: 'intermediate', description: 'Entre deux barres parallèles, descends et remonte.' },

  // Back
  { name: 'Deadlift', muscle: 'back', difficulty: 'advanced', description: 'Soulève une barre du sol jusqu\'à la position debout.' },
  { name: 'Pull Up', muscle: 'back', difficulty: 'intermediate', description: 'Suspendu à une barre, tire ton corps vers le haut.' },
  { name: 'Bent Over Row', muscle: 'back', difficulty: 'intermediate', description: 'Penché en avant, tire la barre vers ton abdomen.' },
  { name: 'Lat Pulldown', muscle: 'back', difficulty: 'beginner', description: 'Tire la barre vers ta poitrine à la poulie haute.' },
  { name: 'Seated Cable Row', muscle: 'back', difficulty: 'beginner', description: 'Tire la poignée vers ton ventre à la poulie basse.' },

  // Legs
  { name: 'Squat', muscle: 'legs', difficulty: 'intermediate', description: 'Barre sur les épaules, descends en flexion de jambes.' },
  { name: 'Leg Press', muscle: 'legs', difficulty: 'beginner', description: 'Pousse la plateforme avec les pieds à la presse.' },
  { name: 'Romanian Deadlift', muscle: 'legs', difficulty: 'intermediate', description: 'Travail des ischio-jambiers avec barre ou haltères.' },
  { name: 'Lunges', muscle: 'legs', difficulty: 'beginner', description: 'Pas en avant avec flexion du genou arrière.' },
  { name: 'Leg Curl', muscle: 'legs', difficulty: 'beginner', description: 'Fléchis les genoux à la machine couché.' },
  { name: 'Calf Raises', muscle: 'legs', difficulty: 'beginner', description: 'Monte sur la pointe des pieds pour travailler les mollets.' },

  // Shoulders
  { name: 'Overhead Press', muscle: 'shoulders', difficulty: 'intermediate', description: 'Pousse la barre au-dessus de la tête depuis les épaules.' },
  { name: 'Lateral Raise', muscle: 'shoulders', difficulty: 'beginner', description: 'Lève les haltères sur les côtés à hauteur d\'épaule.' },
  { name: 'Front Raise', muscle: 'shoulders', difficulty: 'beginner', description: 'Lève les haltères devant toi à hauteur d\'épaule.' },
  { name: 'Arnold Press', muscle: 'shoulders', difficulty: 'intermediate', description: 'Rotation des paumes pendant le développé épaules.' },

  // Arms
  { name: 'Bicep Curl', muscle: 'arms', difficulty: 'beginner', description: 'Fléchis les coudes avec haltères pour travailler les biceps.' },
  { name: 'Tricep Pushdown', muscle: 'arms', difficulty: 'beginner', description: 'Pousse la corde vers le bas à la poulie haute.' },
  { name: 'Hammer Curl', muscle: 'arms', difficulty: 'beginner', description: 'Curl avec les paumes face à face.' },
  { name: 'Skull Crusher', muscle: 'arms', difficulty: 'intermediate', description: 'Allongé, descends la barre vers le front et remonte.' },

  // Core
  { name: 'Plank', muscle: 'core', difficulty: 'beginner', description: 'Position gainage, maintiens le corps droit.' },
  { name: 'Crunch', muscle: 'core', difficulty: 'beginner', description: 'Allongé, soulève les épaules vers les genoux.' },
  { name: 'Russian Twist', muscle: 'core', difficulty: 'beginner', description: 'Assis, tourne le buste de gauche à droite.' },
  { name: 'Leg Raise', muscle: 'core', difficulty: 'intermediate', description: 'Allongé, lève les jambes tendues à la verticale.' },
  { name: 'Ab Wheel', muscle: 'core', difficulty: 'advanced', description: 'Roule la roue abdominale vers l\'avant et reviens.' },

  // Cardio
  { name: 'Running', muscle: 'cardio', difficulty: 'all levels', description: 'Course à pied, excellent pour le cardio et l\'endurance.' },
  { name: 'Cycling', muscle: 'cardio', difficulty: 'all levels', description: 'Vélo, faible impact sur les articulations.' },
  { name: 'Jump Rope', muscle: 'cardio', difficulty: 'beginner', description: 'Corde à sauter, brûle beaucoup de calories rapidement.' },
  { name: 'Rowing Machine', muscle: 'cardio', difficulty: 'intermediate', description: 'Rameur, sollicite tout le corps.' },
  { name: 'Burpees', muscle: 'cardio', difficulty: 'intermediate', description: 'Squat + planche + saut, exercice cardio intense.' },
];

module.exports = exercises;