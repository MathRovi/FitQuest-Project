import { useState, useEffect } from 'react';
import { getExercises } from '../services/api';
import { useTranslation } from 'react-i18next';

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
  'all levels': 'bg-blue-100 text-blue-700'
};

const MUSCLE_ICONS = {
  chest: '💪', back: '🔙', legs: '🦵', shoulders: '🏋️',
  arms: '💪', core: '🎯', cardio: '❤️'
};

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

export default function ExerciseLibrary() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState([]);
  const [total, setTotal] = useState(0);
  const [muscle, setMuscle] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const MUSCLES = [
    { value: 'all', label: t('exercises.allMuscles') },
    { value: 'chest', label: t('exercises.muscles.chest') },
    { value: 'back', label: t('exercises.muscles.back') },
    { value: 'legs', label: t('exercises.muscles.legs') },
    { value: 'shoulders', label: t('exercises.muscles.shoulders') },
    { value: 'arms', label: t('exercises.muscles.arms') },
    { value: 'core', label: t('exercises.muscles.core') },
    { value: 'cardio', label: t('exercises.muscles.cardio') },
  ];

  useEffect(() => {
    fetchExercises();
    setPage(1);
  }, [muscle, difficulty, search]);

  const fetchExercises = async () => {
    const params = {};
    if (muscle !== 'all') params.muscle = muscle;
    if (difficulty !== 'all') params.difficulty = difficulty;
    if (search) params.search = search;
    const res = await getExercises(params);
    setExercises(res.data.exercises);
    setTotal(res.data.total);
  };

  const paginated = exercises.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(exercises.length / PER_PAGE);

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-6">
        {t('exercises.title')}
      </h1>

      {/* Recherche */}
      <div className="card mb-4">
        <input
          placeholder={`🔍 ${t('exercises.search')}`}
          className="input-field"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filtres muscles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {MUSCLES.map(m => (
          <button key={m.value} onClick={() => setMuscle(m.value)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-medium transition-all ${
              muscle === m.value
                ? 'bg-primary text-white shadow'
                : 'bg-white text-text-muted hover:bg-gray-50 shadow'
            }`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Filtres difficulté */}
      <div className="flex gap-2 mb-6">
        {DIFFICULTIES.map(d => (
          <button key={d} onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-medium transition-all capitalize ${
              difficulty === d
                ? 'bg-text-main text-white shadow'
                : 'bg-white text-text-muted hover:bg-gray-50 shadow'
            }`}>
            {d === 'all' ? t('exercises.allLevels') : d}
          </button>
        ))}
      </div>

      {/* Compteur */}
      <p className="font-body text-sm text-text-muted mb-4">
        {total} {total > 1 ? t('exercises.founds') : t('exercises.found')}
      </p>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {paginated.map((ex, i) => (
          <div key={i}
            onClick={() => setSelected(selected?.name === ex.name ? null : ex)}
            className={`card cursor-pointer transition-all hover:shadow-card-hover ${
              selected?.name === ex.name ? 'border-2 border-primary' : ''
            }`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-3xl">{MUSCLE_ICONS[ex.muscle] || '🏋️'}</span>
              <span className={`text-xs px-2 py-1 rounded-full capitalize font-heading font-medium ${DIFFICULTY_COLORS[ex.difficulty]}`}>
                {ex.difficulty}
              </span>
            </div>
            <h3 className="font-heading font-bold text-text-main mb-1">{ex.name}</h3>
            <p className="font-body text-xs text-primary capitalize mb-2">
              {MUSCLES.find(m => m.value === ex.muscle)?.label || ex.muscle}
            </p>
            {selected?.name === ex.name && (
              <p className="font-body text-sm text-text-muted mt-3 pt-3 border-t">
                {ex.description}
              </p>
            )}
            <p className="font-body text-xs text-gray-400 mt-2">
              {selected?.name === ex.name ? t('exercises.clickClose') : t('exercises.clickDetails')}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white shadow disabled:opacity-40 hover:bg-gray-50">
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-xl shadow ${
                page === p ? 'bg-primary text-white' : 'bg-white hover:bg-gray-50'
              }`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-white shadow disabled:opacity-40 hover:bg-gray-50">
            →
          </button>
        </div>
      )}
    </div>
  );
}