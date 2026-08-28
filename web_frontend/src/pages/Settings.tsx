import { useTranslation } from 'react-i18next';
import { Card } from '@/components/common';
import { LanguageSelector } from '@/components/common';

export default function Settings() {
  const { t } = useTranslation();
  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 700, marginBottom: '1.25rem' }}>{t('settings.title')}</h1>
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>{t('settings.language')}</span>
          <LanguageSelector />
        </div>
      </Card>
    </div>
  );
}
