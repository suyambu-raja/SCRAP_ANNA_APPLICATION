import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import Splash from '@/pages/Splash';
import { useAuthStore } from '@/store/useAuthStore';
import { DevRoleSwitcher } from '@/components/dev/DevRoleSwitcher';
import '@/i18n';
import '@/styles/globals.css';

function AppContent() {
  const [showInitialSplash, setShowInitialSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowInitialSplash(false);
  }, []);

  return (
    <>
      {showInitialSplash && (
        <Splash onComplete={handleSplashComplete} isInitialLaunch={true} />
      )}
      <AppRoutes />
      <DevRoleSwitcher />
    </>
  );
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
