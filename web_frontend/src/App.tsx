import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import { useAuthStore } from '@/store/useAuthStore';
import { DevRoleSwitcher } from '@/components/dev/DevRoleSwitcher';
import '@/i18n';
import '@/styles/globals.css';

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <DevRoleSwitcher />
    </BrowserRouter>
  );
}
