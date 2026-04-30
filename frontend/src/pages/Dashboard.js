import { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="font-heading text-primary text-xl animate-pulse">
        {t('dashboard.loading')}
      </div>
    </div>
  );

  const xpInLevel = (user?.xp || 0) % 100;

  return (
    <div className="min-h-screen bg-background p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-main">
            {t('dashboard.welcome')}{' '}
            <span className="text-primary">{user?.username}</span> 
          </h1>
          <p className="font-body text-text-muted mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="card flex items-center gap-3 py-3 px-5">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-heading font-bold text-orange-500 text-lg leading-none">
              {user?.streak || 0} {t('dashboard.days')}
            </p>
            <p className="font-body text-xs text-text-muted">{t('dashboard.currentStreak')}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: t('dashboard.totalXP'),
            value: user?.xp || 0,
            sub: `${t('dashboard.level')} ${user?.level || 1}`,
            color: 'text-primary',
            extra: (
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-700"
                    style={{ width: `${xpInLevel}%` }} />
                </div>
                <p className="font-body text-xs text-text-muted mt-1">{xpInLevel}/100 XP</p>
              </div>
            )
          },
          {
            label: t('dashboard.totalWorkouts'),
            value: data?.totalWorkouts || 0,
            sub: t('dashboard.sinceBeginning'),
            color: 'text-secondary'
          },
          {
            label: t('dashboard.caloriesBurned'),
            value: data?.totalCaloriesBurned || 0,
            sub: t('dashboard.lastDays'),
            color: 'text-orange-500',
            extra: user?.calorieGoal ? (
              <div className="mt-2 text-xs text-text-muted font-body">
                🎯 Objectif : {user.calorieGoal} kcal/jour
              </div>
            ) : null
          },
          {
            label: t('dashboard.badges'),
            value: user?.badges?.length || 0,
            sub: t('dashboard.unlocked'),
            color: 'text-purple-600'
          },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <p className="font-body text-text-muted text-sm">{stat.label}</p>
            <p className={`font-heading text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            <p className="font-body text-xs text-text-muted mt-1">{stat.sub}</p>
            {stat.extra}
          </div>
        ))}
      </div>

      {/* Graphique Calories */}
      <div className="card mb-6 animate-slide-up">
        <h2 className="font-heading text-lg font-semibold text-text-main mb-5">
          {t('dashboard.caloriesChart')}
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data?.chartData || []}>
            <defs>
              <linearGradient id="burned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="eaten" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'Roboto' }} />
            <YAxis tick={{ fontSize: 12, fontFamily: 'Roboto' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', fontFamily: 'Roboto' }} />
            <Legend wrapperStyle={{ fontFamily: 'Roboto', fontSize: '13px' }} />
            <Area type="monotone" dataKey="caloriesBurned"
              name={t('dashboard.burned')}
              stroke="#f97316" fill="url(#burned)" strokeWidth={2.5} />
            <Area type="monotone" dataKey="caloriesEaten"
              name={t('dashboard.consumed')}
              stroke="#8b5cf6" fill="url(#eaten)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique Workouts */}
      <div className="card mb-6 animate-slide-up">
        <h2 className="font-heading text-lg font-semibold text-text-main mb-5">
          {t('dashboard.workoutsPerDay')}
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data?.chartData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'Roboto' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fontFamily: 'Roboto' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', fontFamily: 'Roboto' }} />
            <Bar dataKey="workouts" name="Workouts" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Badges */}
      {user?.badges?.length > 0 && (
        <div className="card animate-fade-in">
          <h2 className="font-heading text-lg font-semibold text-text-main mb-4">
            {t('dashboard.unlockedBadges')}
          </h2>
          <div className="flex gap-3 flex-wrap">
            {user.badges.map(badge => (
              <span key={badge}
                className="bg-primary-light text-primary px-4 py-2 rounded-xl text-sm font-heading font-medium border border-primary/20">
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}