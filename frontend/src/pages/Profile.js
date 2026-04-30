import { useState, useEffect } from 'react';
import { getStats, updateUsername, updatePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ALL_BADGES = [
  { id: 'First Workout', icon: '🏋️' },
  { id: 'Fitness Beginner', icon: '⭐' },
  { id: 'Consistency Champion', icon: '🏆' },
  { id: '7 Day Streak', icon: '🔥' },
];

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    getStats().then(res => {
      setStats(res.data);
      setUsername(res.data.user.username);
    });
  }, []);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameMsg(null);
    try {
      await updateUsername({ username });
      await refreshUser();
      toast.success(t('profile.usernameUpdated'));
      setUsernameMsg({ type: 'success', text: t('profile.usernameUpdated') });
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
      setUsernameMsg({ type: 'error', text: err.response?.data?.message || t('common.error') });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(t('profile.passwordMismatch'));
      return setPasswordMsg({ type: 'error', text: t('profile.passwordMismatch') });
    }
    try {
      await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success(t('profile.passwordUpdated'));
      setPasswordMsg({ type: 'success', text: t('profile.passwordUpdated') });
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || t('common.error') });
    }
  };

  if (!stats) return (
    <div className="flex justify-center items-center h-screen">
      <p className="font-heading text-primary animate-pulse">{t('profile.loading')}</p>
    </div>
  );

  const xpInLevel = (user?.xp || 0) % 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-6">
        {t('profile.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Carte profil */}
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-heading font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-text-main">{user?.username}</h2>
              <p className="font-body text-text-muted text-sm">{stats.user.email}</p>
              <p className="font-body text-primary text-sm font-medium">
                {t('profile.level')} {user?.level} • {user?.xp} {t('profile.xpToNext')}
              </p>
            </div>
          </div>

          {/* Barre XP */}
          <div className="mb-6">
            <div className="flex justify-between font-body text-sm text-text-muted mb-1">
              <span>{t('profile.level')} {user?.level}</span>
              <span>{t('profile.level')} {(user?.level || 1) + 1}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${xpInLevel}%` }} />
            </div>
            <p className="font-body text-xs text-text-muted mt-1 text-center">
              {xpInLevel} / 100 {t('profile.xpToNext')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: stats.totalWorkouts, label: t('profile.totalWorkouts'), color: 'text-secondary' },
              { value: stats.totalMeals, label: t('profile.totalMeals'), color: 'text-purple-600' },
              { value: stats.totalCaloriesBurned, label: t('profile.caloriesBurned'), color: 'text-orange-500' },
              { value: stats.totalDuration, label: t('profile.trainingMinutes'), color: 'text-primary' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="font-body text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="card">
          <h2 className="font-heading text-lg font-bold text-text-main mb-4">
            {t('profile.badges')} ({user?.badges?.length || 0}/{ALL_BADGES.length})
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {ALL_BADGES.map(badge => {
              const earned = user?.badges?.includes(badge.id);
              return (
                <div key={badge.id}
                  className={`rounded-xl p-4 text-center transition-all ${
                    earned ? 'badge-earned' : 'badge-locked'
                  }`}>
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="font-heading text-xs font-bold text-text-main">{badge.id}</p>
                  {earned && (
                    <span className="font-body text-xs text-primary font-medium">
                      {t('achievements.unlocked')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Streak */}
          <div className="mt-4 bg-orange-50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="font-heading font-bold text-orange-600 text-lg">
                {user?.streak || 0} {t('profile.days')}
              </p>
              <p className="font-body text-xs text-text-muted">{t('profile.currentStreak')}</p>
            </div>
          </div>
        </div>

        {/* Modifier username */}
        <div className="card">
          <h2 className="font-heading text-lg font-bold text-text-main mb-4">
            {t('profile.changeUsername')}
          </h2>
          {usernameMsg && (
            <div className={`mb-4 p-3 rounded-xl font-body text-sm ${
              usernameMsg.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {usernameMsg.text}
            </div>
          )}
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <input type="text"
              placeholder={t('profile.newUsername')}
              className="input-field"
              value={username}
              onChange={e => setUsername(e.target.value)}
              minLength={3} required />
            <button type="submit" className="btn-primary w-full">
              {t('profile.update')}
            </button>
          </form>
        </div>

        {/* Modifier mot de passe */}
        <div className="card">
          <h2 className="font-heading text-lg font-bold text-text-main mb-4">
            {t('profile.changePassword')}
          </h2>
          {passwordMsg && (
            <div className={`mb-4 p-3 rounded-xl font-body text-sm ${
              passwordMsg.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {passwordMsg.text}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input type="password"
              placeholder={t('profile.currentPassword')}
              className="input-field"
              value={passwords.currentPassword}
              onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
              required />
            <input type="password"
              placeholder={t('profile.newPassword')}
              className="input-field"
              value={passwords.newPassword}
              onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
              minLength={6} required />
            <input type="password"
              placeholder={t('profile.confirmPassword')}
              className="input-field"
              value={passwords.confirmPassword}
              onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
              required />
            <button type="submit" className="btn-secondary w-full">
              {t('profile.changePasswordBtn')}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}