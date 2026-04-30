import { useState, useEffect } from 'react';
import { getWorkouts, createWorkout, deleteWorkout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const getDateRange = (period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (period) {
    case 'today':
      return { startDate: today.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
    case 'week':
      const week = new Date(today);
      week.setDate(week.getDate() - 7);
      return { startDate: week.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
    case 'month':
      const month = new Date(today);
      month.setDate(month.getDate() - 30);
      return { startDate: month.toISOString().split('T')[0], endDate: today.toISOString().split('T')[0] };
    default:
      return { startDate: '', endDate: '' };
  }
};

export default function Workouts() {
  const { t } = useTranslation();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'strength', duration: '', caloriesBurned: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { refreshUser } = useAuth();

  const TYPES = [
    { value: 'all', label: t('workouts.allTypes') },
    { value: 'strength', label: t('workouts.types.strength') },
    { value: 'cardio', label: t('workouts.types.cardio') },
    { value: 'yoga', label: t('workouts.types.yoga') },
    { value: 'other', label: t('workouts.types.other') },
  ];

  const PERIODS = [
    { value: 'all', label: t('workouts.allPeriods') },
    { value: 'today', label: t('workouts.today') },
    { value: 'week', label: t('workouts.last7') },
    { value: 'month', label: t('workouts.last30') },
    { value: 'custom', label: t('workouts.custom') },
  ];

  useEffect(() => { fetchWorkouts(); }, [typeFilter, periodFilter, customStart, customEnd]);

  const fetchWorkouts = async () => {
    const params = {};
    if (typeFilter !== 'all') params.type = typeFilter;
    if (search) params.search = search;
    if (periodFilter === 'custom') {
      if (customStart) params.startDate = customStart;
      if (customEnd) params.endDate = customEnd;
    } else if (periodFilter !== 'all') {
      const { startDate, endDate } = getDateRange(periodFilter);
      params.startDate = startDate;
      params.endDate = endDate;
    }
    const res = await getWorkouts(params);
    setWorkouts(res.data);
  };

  const filtered = workouts.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createWorkout(form);
      await refreshUser();
      setForm({ name: '', type: 'strength', duration: '', caloriesBurned: '' });
      setShowForm(false);
      fetchWorkouts();
      toast.success(t('workouts.addedSuccess'));
    } catch (err) {
      toast.error(t('workouts.addError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkout(id);
      await refreshUser();
      fetchWorkouts();
      toast.success(t('workouts.deletedSuccess'));
    } catch (err) {
      toast.error(t('workouts.deleteError'));
    }
  };

  const resetFilters = () => {
    setTypeFilter('all');
    setPeriodFilter('all');
    setCustomStart('');
    setCustomEnd('');
    setSearch('');
  };

  const hasActiveFilters = typeFilter !== 'all' || periodFilter !== 'all' || search !== '';
  const totalDuration = filtered.reduce((s, w) => s + w.duration, 0);
  const totalCalories = filtered.reduce((s, w) => s + w.caloriesBurned, 0);

  return (
    <div className="min-h-screen bg-background p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-main">{t('workouts.title')}</h1>
          <p className="font-body text-text-muted text-sm mt-1">
            {filtered.length} {filtered.length > 1 ? t('workouts.founds') : t('workouts.found')}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl font-heading font-semibold text-sm border-2 transition-all ${
              showFilters || hasActiveFilters
                ? 'border-primary bg-primary-light text-primary'
                : 'border-gray-200 text-text-muted hover:border-primary hover:text-primary'
            }`}>
            🔍 {t('workouts.filters')} {hasActiveFilters && '●'}
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            {showForm ? t('workouts.cancel') : t('workouts.add')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center py-4">
          <p className="font-heading text-2xl font-bold text-primary">{filtered.length}</p>
          <p className="font-body text-xs text-text-muted mt-1">{t('workouts.totalWorkouts')}</p>
        </div>
        <div className="card text-center py-4">
          <p className="font-heading text-2xl font-bold text-secondary">{totalDuration}</p>
          <p className="font-body text-xs text-text-muted mt-1">{t('workouts.totalMinutes')}</p>
        </div>
        <div className="card text-center py-4">
          <p className="font-heading text-2xl font-bold text-orange-500">{totalCalories}</p>
          <p className="font-body text-xs text-text-muted mt-1">{t('workouts.totalCalories')}</p>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="card mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-lg font-semibold text-text-main">{t('workouts.filters')}</h2>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="font-body text-sm text-red-400 hover:text-red-600 font-medium">
                {t('workouts.resetFilters')}
              </button>
            )}
          </div>
          <div className="mb-4">
            <label className="font-body text-sm font-medium text-text-muted mb-2 block">
              {t('workouts.searchByName')}
            </label>
            <input placeholder={t('workouts.searchPlaceholder')}
              className="input-field"
              value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="font-body text-sm font-medium text-text-muted mb-2 block">
              {t('workouts.workoutType')}
            </label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t2 => (
                <button key={t2.value} onClick={() => setTypeFilter(t2.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-heading font-medium transition-all ${
                    typeFilter === t2.value
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-text-muted hover:bg-primary-light hover:text-primary'
                  }`}>
                  {t2.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="font-body text-sm font-medium text-text-muted mb-2 block">
              {t('workouts.period')}
            </label>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map(p => (
                <button key={p.value} onClick={() => setPeriodFilter(p.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-heading font-medium transition-all ${
                    periodFilter === p.value
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-text-muted hover:bg-primary-light hover:text-primary'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {periodFilter === 'custom' && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="font-body text-sm font-medium text-text-muted mb-2 block">
                  {t('workouts.startDate')}
                </label>
                <input type="date" className="input-field" value={customStart}
                  onChange={e => setCustomStart(e.target.value)} />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-text-muted mb-2 block">
                  {t('workouts.endDate')}
                </label>
                <input type="date" className="input-field" value={customEnd}
                  onChange={e => setCustomEnd(e.target.value)} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="card mb-6 animate-slide-up">
          <h2 className="font-heading text-lg font-semibold text-text-main mb-4">
            {t('workouts.newWorkout')}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input placeholder={t('workouts.workoutName')} required
              className="input-field col-span-2"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <select className="input-field" value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}>
              <option value="strength">{t('workouts.types.strength')}</option>
              <option value="cardio">{t('workouts.types.cardio')}</option>
              <option value="yoga">{t('workouts.types.yoga')}</option>
              <option value="other">{t('workouts.types.other')}</option>
            </select>
            <input type="number" placeholder={t('workouts.duration')} required
              className="input-field"
              value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
            <input type="number" placeholder={t('workouts.caloriesBurned')} required
              className="input-field"
              value={form.caloriesBurned} onChange={e => setForm({...form, caloriesBurned: e.target.value})} />
            <button type="submit" disabled={loading} className="btn-secondary col-span-2 disabled:opacity-50">
              {loading ? t('workouts.saving') : t('workouts.save')}
            </button>
          </form>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-3">
        {filtered.map((w, i) => (
          <div key={w._id} className="card flex justify-between items-center animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                w.type === 'cardio' ? 'bg-orange-100' :
                w.type === 'strength' ? 'bg-blue-100' :
                w.type === 'yoga' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {w.type === 'cardio' ? '🏃' : w.type === 'strength' ? '💪' : w.type === 'yoga' ? '🧘' : '⚡'}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-text-main">{w.name}</h3>
                <p className="font-body text-sm text-text-muted capitalize">
                  {w.type} • {w.duration} {t('common.minutes')} • {w.caloriesBurned} {t('common.kcal')}
                </p>
                <p className="font-body text-xs text-gray-400">
                  {new Date(w.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(w._id)}
              className="font-body text-red-400 hover:text-red-600 text-sm font-medium transition-colors">
              {t('workouts.delete')}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-4xl mb-4">🏋️</p>
            <p className="font-heading text-lg font-semibold text-text-muted">{t('workouts.noWorkout')}</p>
            <p className="font-body text-sm text-gray-400 mt-1">
              {hasActiveFilters ? t('workouts.modifyFilters') : t('workouts.noWorkoutSub')}
            </p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="btn-primary mt-4 text-sm">
                {t('workouts.resetFilters')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}