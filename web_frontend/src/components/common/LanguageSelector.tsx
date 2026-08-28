import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import styles from './LanguageSelector.module.css';

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggle = () => {
    const next = currentLang === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('sa_language', next);
  };

  return (
    <button
      className={[styles.btn, compact ? styles.compact : ''].join(' ')}
      onClick={toggle}
      aria-label="Switch language"
      title={currentLang === 'en' ? 'தமிழ் மாற்று' : 'Switch to English'}
    >
      <Globe size={compact ? 16 : 18} />
      {!compact && <span>{currentLang === 'en' ? 'TA' : 'EN'}</span>}
    </button>
  );
}
