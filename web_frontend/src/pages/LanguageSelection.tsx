import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/common';
import styles from './LanguageSelection.module.css';

export default function LanguageSelection() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<'en' | 'ta'>('en');

  const handleContinue = () => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('sa_language', selectedLang);
    // Proceed to Step 3: Public Homepage
    navigate('/home', { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            src="/logo-icon.png"
            alt="Scrap Anna"
            className={styles.logoImg}
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
          />
          <h1 className={styles.title}>Choose your language</h1>
          <p className={styles.subtitle}>Select your preferred language to continue.</p>
        </div>

        <div className={styles.options}>
          {/* English Option */}
          <button
            type="button"
            className={[styles.langCard, selectedLang === 'en' ? styles.langCardActive : ''].join(' ')}
            onClick={() => {
              setSelectedLang('en');
              i18n.changeLanguage('en');
            }}
          >
            <div className={styles.langInfo}>
              <span className={styles.langName}>English</span>
              <span className={styles.langSub}>Default system language</span>
            </div>
            <div className={styles.radio}>
              {selectedLang === 'en' && <Check size={16} className={styles.checkIcon} />}
            </div>
          </button>

          {/* Tamil Option */}
          <button
            type="button"
            className={[styles.langCard, selectedLang === 'ta' ? styles.langCardActive : ''].join(' ')}
            onClick={() => {
              setSelectedLang('ta');
              i18n.changeLanguage('ta');
            }}
          >
            <div className={styles.langInfo}>
              <span className={styles.langName}>தமிழ்</span>
              <span className={styles.langSub}>தமிழில் பயன்படுத்தவும்</span>
            </div>
            <div className={styles.radio}>
              {selectedLang === 'ta' && <Check size={16} className={styles.checkIcon} />}
            </div>
          </button>
        </div>

        <Button fullWidth size="lg" icon={<ArrowRight size={18} />} onClick={handleContinue}>
          {selectedLang === 'ta' ? 'தொடரவும்' : 'Continue'}
        </Button>

        <p className={styles.footerNote}>
          <Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          {selectedLang === 'ta'
            ? 'அமைப்புகளில் எப்போது வேண்டுமானாலும் மொழியை மாற்றலாம்'
            : 'You can change your language anytime from Settings'}
        </p>
      </div>
    </div>
  );
}
