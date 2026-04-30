import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getStats } from '../services/api';

const ALL_BADGES = [
  {
    id: 'First Workout',
    icon: '🏋️',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    requirement: 1,
    type: 'workouts',
  },
  {
    id: 'Fitness Beginner',
    icon: '⭐',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    requirement: 10,
    type: 'workouts',
  },
  {
    id: 'Consistency Champion',
    icon: '🏆',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    requirement: 50,
    type: 'workouts',
  },
  {
    id: '7 Day Streak',
    icon: '🔥',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
    requirement: 7,
    type: 'streak',
  },
];

// Composant AnimatedCounter
function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

// Composant ProgressBar animée
function AnimatedProgressBar({ value, max, color = 'bg-primary', delay = 0 }) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), delay + 100);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// Composant Badge Card
function BadgeCard({ badge, earned, progress, max, t, index }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const percentage = Math.min(Math.round((progress / max) * 100), 100);

  return (
    <div className={`relative card transition-all duration-500 ${
      animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    } ${earned ? 'border-2 ' + badge.borderColor : 'border border-gray-200'}`}>

      {/* Badge débloqué — effet brillant */}
      {earned && (
        <div className="absolute top-3 right-3">
          <span className="bg-green-100 text-green-700 text-xs font-heading font-bold px-2 py-1 rounded-full">
            {t('achievements.unlocked')}
          </span>
        </div>
      )}

      {/* Icône avec gradient */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto
        ${earned
          ? `bg-gradient-to-br ${badge.color} shadow-lg`
          : 'bg-gray-100 grayscale'
        }`}>
        {badge.icon}
      </div>

      {/* Nom et description */}
      <h3 className="font-heading font-bold text-text-main text-center mb-1">
        {badge.id}
      </h3>
      <p className="font-body text-xs text-text-muted text-center mb-4">
        {t(`achievements.badgeDescriptions.${badge.id}`)}
      </p>

      {/* Barre de progression */}
      <div className="space-y-1">
        <div className="flex justify-between font-body text-xs text-text-muted">
          <span>{t('achievements.progress')}</span>
          <span className="font-semibold">
            {Math.min(progress, max)}/{max}
          </span>
        </div>
        <AnimatedProgressBar
          value={Math.min(progress, max)}
          max={max}
          color={earned ? `bg-gradient-to-r ${badge.color}` : 'bg-gray-300'}
          delay={index * 150}
        />
        <p className="font-body text-xs text-right text-text-muted">
          {percentage}%
        </p>
      </div>

      {/* Effet de verrouillage */}
      {!earned && (
        <div className="mt-3 text-center">
          <span className="font-body text-xs text-gray-400">
            🔒 {t('achievements.locked')}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Achievements() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const earnedBadges = user?.badges || [];
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const xpInLevel = xp % 100;
  const xpToNextLevel = 100 - xpInLevel;

  useEffect(() => {
    getStats().then(res => setStats(res.data));
    // Animation confetti si badges récemment débloqués
    if (earnedBadges.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, []);

  const getBadgeProgress = (badge) => {
    if (!stats) return 0;
    if (badge.type === 'workouts') return stats.totalWorkouts;
    if (badge.type === 'streak') return user?.streak || 0;
    return 0;
  };

  const xpActivities = [
    { icon: '🏋️', label: t('achievements.addWorkout'), xp: '+20 XP', color: 'text-primary', bg: 'bg-primary-light' },
    { icon: '🥗', label: t('achievements.logMeal'), xp: '+10 XP', color: 'text-secondary', bg: 'bg-secondary-light' },
    { icon: '🔥', label: t('achievements.streak7'), xp: '+50 XP', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: '⬆️', label: 'Level up', xp: '100 XP', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: '24px',
              }}>
              {['🎉', '⭐', '🏆', '🔥', '💪'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <h1 className="font-heading text-3xl font-bold text-text-main mb-6">
        {t('achievements.title')}
      </h1>

      {/* Carte XP & Niveau */}
      <div className="card mb-6 animate-slide-up">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="font-body text-text-muted text-sm mb-1">{t('achievements.totalXP')}</p>
            <p className="font-heading text-5xl font-bold text-primary">
              <AnimatedCounter value={xp} />
            </p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="font-heading text-white text-2xl font-bold">{level}</span>
            </div>
            <p className="font-body text-xs text-text-muted mt-1">{t('achievements.yourLevel')}</p>
          </div>
        </div>

        {/* Barre XP vers prochain niveau */}
        <div className="space-y-2">
          <div className="flex justify-between font-body text-sm text-text-muted">
            <span>{t('achievements.yourLevel')} {level}</span>
            <span>{t('achievements.nextLevel')} {level + 1}</span>
          </div>
          <AnimatedProgressBar value={xpInLevel} max={100} color="bg-gradient-to-r from-primary to-blue-400" />
          <div className="flex justify-between font-body text-xs text-text-muted">
            <span>{xpInLevel}/100 XP</span>
            <span>{xpToNextLevel} {t('achievements.xpNeeded')}</span>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-secondary">
              <AnimatedCounter value={stats?.totalWorkouts || 0} />
            </p>
            <p className="font-body text-xs text-text-muted">Workouts</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-orange-500">
              <AnimatedCounter value={user?.streak || 0} />
            </p>
            <p className="font-body text-xs text-text-muted">Streak 🔥</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-purple-600">
              {earnedBadges.length}/{ALL_BADGES.length}
            </p>
            <p className="font-body text-xs text-text-muted">{t('achievements.badges')}</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <h2 className="font-heading text-xl font-bold text-text-main mb-4">
        {t('achievements.allBadges')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {ALL_BADGES.map((badge, i) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={earnedBadges.includes(badge.id)}
            progress={getBadgeProgress(badge)}
            max={badge.requirement}
            t={t}
            index={i}
          />
        ))}
      </div>

      {/* Comment gagner des XP */}
      <div className="card animate-fade-in">
        <h2 className="font-heading text-lg font-bold text-text-main mb-4">
          {t('achievements.howToEarn')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {xpActivities.map((activity, i) => (
            <div key={i} className={`${activity.bg} rounded-xl p-4 text-center`}>
              <p className="text-2xl mb-2">{activity.icon}</p>
              <p className="font-body text-xs text-text-muted mb-1">{activity.label}</p>
              <p className={`font-heading font-bold text-lg ${activity.color}`}>{activity.xp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}