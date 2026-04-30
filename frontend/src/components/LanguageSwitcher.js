import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('fitquest_lang', lang);
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
      <button
        onClick={() => toggleLang('fr')}
        className={`px-3 py-1.5 rounded-lg text-sm font-heading font-semibold transition-all ${
          i18n.language === 'fr'
            ? 'bg-white text-primary shadow-sm'
            : 'text-text-muted hover:text-primary'
        }`}>
        🇫🇷 FR
      </button>
      <button
        onClick={() => toggleLang('en')}
        className={`px-3 py-1.5 rounded-lg text-sm font-heading font-semibold transition-all ${
          i18n.language === 'en'
            ? 'bg-white text-primary shadow-sm'
            : 'text-text-muted hover:text-primary'
        }`}>
        🇬🇧 EN
      </button>
    </div>
  );
}