import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { icon: '🏋️', title: 'Suivi des Workouts', desc: t('home.heroSub') },
    { icon: '🥗', title: 'Nutrition Tracker', desc: t('home.heroSub') },
    { icon: '⭐', title: 'Système de XP', desc: t('home.heroSub') },
    { icon: '🏆', title: 'Badges & Achievements', desc: t('home.heroSub') },
    { icon: '🔥', title: 'Streaks journaliers', desc: t('home.heroSub') },
    { icon: '📊', title: 'Dashboard visuel', desc: t('home.heroSub') },
  ];

  const features_i18n = [
    { icon: '🏋️', title: 'Workout Tracking', titleFr: 'Suivi des Workouts',
      descKey: 'Enregistre tes séances, exercices, durée et calories brûlées en quelques secondes.' },
    { icon: '🥗', title: 'Nutrition Tracker', titleFr: 'Nutrition Tracker',
      descKey: 'Suis tes repas quotidiens et monitore tes apports caloriques, protéines et glucides.' },
    { icon: '⭐', title: 'XP System', titleFr: 'Système de XP',
      descKey: "Gagne des points d'expérience à chaque action et monte de niveau progressivement." },
    { icon: '🏆', title: 'Badges & Achievements', titleFr: 'Badges & Achievements',
      descKey: 'Débloque des badges en atteignant des objectifs et reste motivé sur le long terme.' },
    { icon: '🔥', title: 'Daily Streaks', titleFr: 'Streaks journaliers',
      descKey: 'Maintiens ta série de jours actifs consécutifs pour booster ta progression.' },
    { icon: '📊', title: 'Visual Dashboard', titleFr: 'Dashboard visuel',
      descKey: 'Visualise tes progrès avec des graphiques clairs et des statistiques détaillées.' },
  ];

  const steps = [
    { number: '01', titleKey: 'Crée ton compte', descKey: 'Inscription gratuite en 30 secondes.' },
    { number: '02', titleKey: 'Log tes activités', descKey: 'Ajoute tes workouts et repas facilement.' },
    { number: '03', titleKey: 'Gagne des récompenses', descKey: 'Accumule des XP et débloque des badges.' },
  ];

  const stats = [
    { value: '20 XP', label: t('home.perWorkout') },
    { value: '10 XP', label: t('home.perMeal') },
    { value: '50 XP', label: t('home.perStreak') },
    { value: '4', label: 'badges' },
  ];

  return (
    <div className="min-h-screen bg-background font-body">

      {/* Navbar publique */}
      <nav className="bg-white shadow-card px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-heading text-2xl font-bold text-primary">
          Fit<span className="text-secondary">Quest</span>
        </span>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link to="/login"
            className="px-5 py-2.5 rounded-xl font-heading font-semibold text-sm text-primary border-2 border-primary hover:bg-primary-light transition-all">
            {t('home.login')}
          </Link>
          <Link to="/register"
            className="btn-primary text-sm">
            {t('home.ctaBtn')}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6">
            🎮 {t('home.gamified')}
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-text-main mb-6 leading-tight">
            {t('home.hero')}{' '}
            <span className="text-primary">{t('home.heroFitness')}</span>{' '}
            {t('home.heroIn')}{' '}
            <span className="text-secondary">{t('home.heroAdventure')}</span>
          </h1>
          <p className="font-body text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('home.heroSub')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-lg">
              {t('home.startFree')}
            </Link>
            <Link to="/login"
              className="px-8 py-4 rounded-xl font-heading font-semibold text-lg text-text-muted border-2 border-gray-200 hover:border-primary hover:text-primary transition-all">
              {t('home.login')}
            </Link>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((s, i) => (
              <div key={i} className="card text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="font-heading text-2xl font-bold text-primary">{s.value}</p>
                <p className="font-body text-sm text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-text-main mb-4">
              {t('home.featuresTitle')}
            </h2>
            <p className="font-body text-text-muted text-lg">{t('home.featuresSub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features_i18n.map((f, i) => (
              <div key={i} className="card animate-slide-up group"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-text-main mb-2">
                  {f.title}
                </h3>
                <p className="font-body text-text-muted text-sm leading-relaxed">{f.descKey}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-text-main mb-4">
              {t('home.howTitle')}
            </h2>
            <p className="font-body text-text-muted text-lg">{t('home.howSub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-text-main mb-2">{step.titleKey}</h3>
                <p className="font-body text-text-muted text-sm leading-relaxed">{step.descKey}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold text-white mb-4">
            {t('home.everyAction')}
          </h2>
          <p className="font-body text-blue-200 text-lg mb-12">
            {t('home.everyActionSub')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏋️', action: t('achievements.addWorkout'), xp: '+20 XP' },
              { icon: '🥗', action: t('achievements.logMeal'), xp: '+10 XP' },
              { icon: '🔥', action: t('achievements.streak7'), xp: '+50 XP' },
              { icon: '⬆️', action: t('home.levelUp'), xp: '100 XP' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-body text-blue-100 text-xs mb-2">{item.action}</p>
                <p className="font-heading text-white font-bold text-lg">{item.xp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto animate-slide-up">
          <h2 className="font-heading text-4xl font-bold text-text-main mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="font-body text-text-muted text-lg mb-8">{t('home.ctaSub')}</p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-lg inline-block">
            {t('home.ctaBtn')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-main py-8 px-6 text-center">
        <p className="font-heading text-2xl font-bold text-white mb-2">
          Fit<span className="text-secondary">Quest</span>
        </p>
        <p className="font-body text-gray-400 text-sm">{t('home.footer')}</p>
        <p className="font-body text-gray-500 text-xs mt-4">
          © 2026 FitQuest — Matheo Rouviere, Adam Saidane, Lucas Bonsergent
        </p>
      </footer>
    </div>
  );
}