import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateCalorieGoal } from '../services/api';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function CalorieGoalWidget({ totalCalories }) {
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(user?.calorieGoal || 2000);
  const [loading, setLoading] = useState(false);

  const goal = user?.calorieGoal || 2000;
  const percentage = Math.min(Math.round((totalCalories / goal) * 100), 100);
  const remaining = goal - totalCalories;
  const exceeded = totalCalories > goal;
  const reached = totalCalories >= goal;

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateCalorieGoal({ calorieGoal: goalInput });
      await refreshUser();
      setEditing(false);
      toast.success(t('nutrition.goalSaved'));
    } catch (err) {
      toast.error(t('nutrition.goalError'));
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-400';
    return 'bg-secondary';
  };

  const getTextColor = () => {
    if (exceeded) return 'text-red-500';
    if (percentage >= 80) return 'text-orange-500';
    return 'text-secondary';
  };

  return (
    <div className="card mb-6 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-main">
            {t('nutrition.calorieGoal')}
          </h2>
          <p className="font-body text-sm text-text-muted">
            {t('nutrition.calorieGoalDesc')} : <span className="font-semibold text-text-main">{goal} kcal</span>
          </p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="font-body text-sm text-primary hover:text-primary-dark font-medium transition-colors">
          ✏️ {t('nutrition.editGoal')}
        </button>
      </div>

      {/* Formulaire édition */}
      {editing && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl animate-fade-in">
          <label className="font-body text-sm font-medium text-text-muted mb-2 block">
            {t('nutrition.calorieGoal')} (kcal)
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min="500"
              max="10000"
              step="50"
              className="input-field flex-1"
              value={goalInput}
              onChange={e => setGoalInput(Number(e.target.value))}
            />
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary text-sm disabled:opacity-50">
              {loading ? '...' : t('nutrition.setGoal')}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-xl font-heading font-semibold text-sm text-text-muted border-2 border-gray-200 hover:border-gray-300 transition-all">
              ✕
            </button>
          </div>

          {/* Suggestions rapides */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {[1500, 1800, 2000, 2200, 2500, 3000].map(val => (
              <button key={val}
                onClick={() => setGoalInput(val)}
                className={`px-3 py-1 rounded-lg text-xs font-heading font-semibold transition-all ${
                  goalInput === val
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-muted border border-gray-200 hover:border-primary hover:text-primary'
                }`}>
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Barre de progression */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between font-body text-sm">
          <span className="text-text-muted">{t('nutrition.progressToGoal')}</span>
          <span className={`font-bold ${getTextColor()}`}>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
          <div
            className={`h-5 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2 ${getBarColor()}`}
            style={{ width: `${percentage}%` }}>
            {percentage > 20 && (
              <span className="text-white text-xs font-heading font-bold">
                {totalCalories}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between font-body text-xs text-text-muted">
          <span>0 kcal</span>
          <span>{goal} kcal</span>
        </div>
      </div>

      {/* Status */}
      <div className={`rounded-xl p-4 text-center ${
        reached
          ? exceeded
            ? 'bg-red-50 border border-red-200'
            : 'bg-green-50 border border-green-200'
          : 'bg-gray-50'
      }`}>
        {reached && !exceeded ? (
          <div>
            <p className="font-heading font-bold text-green-600 text-lg">
              {t('nutrition.goalReached')}
            </p>
            <p className="font-body text-sm text-green-500 mt-1">
              {totalCalories} / {goal} kcal
            </p>
          </div>
        ) : exceeded ? (
          <div>
            <p className="font-heading font-bold text-red-500 text-lg">
              ⚠️ {t('nutrition.exceeded')} {Math.abs(remaining)} kcal
            </p>
            <p className="font-body text-sm text-red-400 mt-1">
              {totalCalories} / {goal} kcal
            </p>
          </div>
        ) : (
          <div className="flex justify-around">
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-orange-500">{totalCalories}</p>
              <p className="font-body text-xs text-text-muted">kcal {t('nutrition.consumed')}</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className={`font-heading text-2xl font-bold ${getTextColor()}`}>
                {Math.abs(remaining)}
              </p>
              <p className="font-body text-xs text-text-muted">
                kcal {t('nutrition.remaining')}
              </p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-primary">{goal}</p>
              <p className="font-body text-xs text-text-muted">{t('nutrition.kcalGoal')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}