import { MerchantLayout } from './MerchantLayout';

/**
 * AppLayout forwards to MerchantLayout to ensure the old legacy Tamil sidebar
 * never renders anywhere in the application.
 */
export function AppLayout() {
  return <MerchantLayout />;
}

export default AppLayout;
