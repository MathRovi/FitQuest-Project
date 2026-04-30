import { useState, useEffect } from 'react';
import { getMeals, getMealHistory, createMeal, deleteMeal } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import CalorieGoalWidget from '../components/CalorieGoalWidget';

export default function Nutrition() {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();

  // Vue active : 'today' ou 'history'
  const [activeTab, setActiveTab] = useState('today');

  // Today
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState({ name: '', mealType: 'breakfast', calories: '', protein: '', carbs: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // History
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedDay, setExpandedDay] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => { fetchMeals(); }, []);
  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab, historyPage]);

  const fetchMeals = async () => {
    const res = await getMeals(today);
    setMeals(res.data);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getMealHistory(historyPage);
      setHistory(res.data.days);
      setTotalPages(res.data.totalPages);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMeal(form);
      await refreshUser();
      setForm({ name: '', mealType: 'breakfast', calories: '', protein: '', carbs: '' });
      setShowForm(false);
      fetchMeals();
      toast.success(t('nutrition.addedSuccess'));
    } catch (err) {
      toast.error(t('nutrition.addError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMeal(id);
      await refreshUser();
      fetchMeals();
      if (activeTab === 'history') fetchHistory();
      toast.success(t('nutrition.deletedSuccess'));
    } catch (err) {
      toast.error(t('nutrition.deleteError'));
    }
  };

  const totalCals = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const todayDate = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today) return `📅 ${t('nutrition.today')}`;
    if (dateStr === yesterday.toISOString().split('T')[0]) return `📅 ${t('nutrition.yesterday')}`;
    return `📅 ${date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`;
  };

  return (
    <div className="min-h-screen bg-background p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-text-main">
          {t('nutrition.title')}
        </h1>
        {activeTab === 'today' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            {showForm ? t('nutrition.cancel') : t('nutrition.addMeal')}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 shadow-card w-fit">
        <button onClick={() => setActiveTab('today')}
          className={`px-6 py-2.5 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'today'
              ? 'bg-primary text-white shadow-md'
              : 'text-text-muted hover:text-primary'
          }`}>
          📅 {t('nutrition.today')}
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'history'
              ? 'bg-primary text-white shadow-md'
              : 'text-text-muted hover:text-primary'
          }`}>
          📚 {t('nutrition.history')}
        </button>
      </div>

      {/* ===== VUE AUJOURD'HUI ===== */}
      {activeTab === 'today' && (
        <div className="animate-fade-in">
          <p className="font-body text-text-muted text-sm mb-4">{today}</p>

          {/* Totaux */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <p className="font-body text-text-muted text-sm">{t('nutrition.calories')}</p>
              <p className="font-heading text-3xl font-bold text-orange-500">{totalCals}</p>
            </div>
            <div className="card text-center">
              <p className="font-body text-text-muted text-sm">{t('nutrition.protein')}</p>
              <p className="font-heading text-3xl font-bold text-primary">{totalProtein}g</p>
            </div>
            <div className="card text-center">
              <p className="font-body text-text-muted text-sm">{t('nutrition.carbs')}</p>
              <p className="font-heading text-3xl font-bold text-purple-600">{totalCarbs}g</p>
            </div>
          </div>

          {/* 🔥 Objectif calorique */}
          <CalorieGoalWidget totalCalories={totalCals} />

          {/* Formulaire */}
          {showForm && (
            <div className="card mb-6 animate-slide-up">
              <h2 className="font-heading text-lg font-semibold text-text-main mb-4">
                {t('nutrition.addMealTitle')}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input placeholder={t('nutrition.foodName')} required
                  className="input-field col-span-2"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <select className="input-field" value={form.mealType}
                  onChange={e => setForm({...form, mealType: e.target.value})}>
                  {mealTypes.map(type => (
                    <option key={type} value={type}>{t(`nutrition.mealTypes.${type}`)}</option>
                  ))}
                </select>
                <input type="number" placeholder={t('nutrition.caloriesField')} required
                  className="input-field"
                  value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} />
                <input type="number" placeholder={t('nutrition.proteinField')}
                  className="input-field"
                  value={form.protein} onChange={e => setForm({...form, protein: e.target.value})} />
                <input type="number" placeholder={t('nutrition.carbsField')}
                  className="input-field"
                  value={form.carbs} onChange={e => setForm({...form, carbs: e.target.value})} />
                <button type="submit" disabled={loading}
                  className="btn-secondary col-span-2 disabled:opacity-50">
                  {loading ? t('nutrition.saving') : t('nutrition.save')}
                </button>
              </form>
            </div>
          )}

          {/* Repas par type */}
          {mealTypes.map(type => {
            const typeMeals = meals.filter(m => m.mealType === type);
            if (typeMeals.length === 0) return null;
            return (
              <div key={type} className="card mb-4">
                <h2 className="font-heading font-bold text-text-main mb-3">
                  {t(`nutrition.mealTypes.${type}`)}
                </h2>
                {typeMeals.map(m => (
                  <div key={m._id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-heading font-medium text-text-main">{m.name}</p>
                      <p className="font-body text-sm text-text-muted">
                        {m.calories} {t('common.kcal')} • {m.protein}g prot • {m.carbs}g glucides
                      </p>
                    </div>
                    <button onClick={() => handleDelete(m._id)}
                      className="font-body text-red-400 hover:text-red-600 text-sm font-medium">
                      {t('nutrition.delete')}
                    </button>
                  </div>
                ))}
              </div>
            );
          })}

          {meals.length === 0 && (
            <div className="card text-center py-16">
              <p className="text-4xl mb-4">🥗</p>
              <p className="font-heading text-lg font-semibold text-text-muted">
                {t('nutrition.noMeals')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== VUE HISTORIQUE ===== */}
      {activeTab === 'history' && (
        <div className="animate-fade-in">
          {historyLoading ? (
            <div className="flex justify-center py-16">
              <p className="font-heading text-primary animate-pulse">{t('common.loading')}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-4xl mb-4">📚</p>
              <p className="font-heading text-lg font-semibold text-text-muted">
                {t('nutrition.noHistory')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((day, i) => (
                <div key={day.date} className="card animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}>
                    <div>
                      <h3 className="font-heading font-bold text-text-main capitalize">
                        {formatDate(day.date)}
                      </h3>
                      <p className="font-body text-sm text-text-muted mt-1">
                        {day.meals.length} repas • {day.totalCalories} kcal •{' '}
                        {day.totalProtein}g prot • {day.totalCarbs}g glucides
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-heading font-bold text-orange-500 text-lg">
                          {day.totalCalories}
                        </p>
                        <p className="font-body text-xs text-text-muted">kcal</p>
                      </div>
                      <span className={`text-gray-400 transition-transform duration-200 ${
                        expandedDay === day.date ? 'rotate-180' : ''
                      }`}>▼</span>
                    </div>
                  </div>

                  {expandedDay === day.date && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-orange-50 rounded-xl p-3 text-center">
                          <p className="font-heading font-bold text-orange-500">{day.totalCalories}</p>
                          <p className="font-body text-xs text-text-muted">{t('nutrition.calories')}</p>
                        </div>
                        <div className="bg-primary-light rounded-xl p-3 text-center">
                          <p className="font-heading font-bold text-primary">{day.totalProtein}g</p>
                          <p className="font-body text-xs text-text-muted">{t('nutrition.protein')}</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-3 text-center">
                          <p className="font-heading font-bold text-purple-600">{day.totalCarbs}g</p>
                          <p className="font-body text-xs text-text-muted">{t('nutrition.carbs')}</p>
                        </div>
                      </div>

                      {mealTypes.map(type => {
                        const typeMeals = day.meals.filter(m => m.mealType === type);
                        if (typeMeals.length === 0) return null;
                        return (
                          <div key={type} className="mb-3">
                            <p className="font-heading font-semibold text-text-muted text-sm mb-2">
                              {t(`nutrition.mealTypes.${type}`)}
                            </p>
                            {typeMeals.map(m => (
                              <div key={m._id}
                                className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl mb-1">
                                <div>
                                  <p className="font-body font-medium text-text-main text-sm">{m.name}</p>
                                  <p className="font-body text-xs text-text-muted">
                                    {m.calories} kcal • {m.protein}g prot
                                  </p>
                                </div>
                                <button onClick={() => handleDelete(m._id)}
                                  className="font-body text-red-400 hover:text-red-600 text-xs font-medium">
                                  {t('nutrition.delete')}
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                disabled={historyPage === 1}
                className="px-4 py-2 rounded-xl bg-white shadow-card font-heading font-semibold text-sm disabled:opacity-40 hover:bg-gray-50 transition-all">
                ←
              </button>
              <span className="font-body text-text-muted text-sm">
                {t('nutrition.page')} {historyPage} {t('nutrition.of')} {totalPages}
              </span>
              <button
                onClick={() => setHistoryPage(p => Math.min(totalPages, p + 1))}
                disabled={historyPage === totalPages}
                className="px-4 py-2 rounded-xl bg-white shadow-card font-heading font-semibold text-sm disabled:opacity-40 hover:bg-gray-50 transition-all">
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}