import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common';
import { MerchantLayout } from '@/layouts/MerchantLayout';
import { IndustryLayout } from '@/layouts/IndustryLayout';
import { HouseholdLayout } from '@/layouts/HouseholdLayout';
import { ProtectedRoute } from './ProtectedRoute';

/* Lazy-loaded pages */
const Splash = lazy(() => import('@/pages/Splash'));
const LanguageSelection = lazy(() => import('@/pages/LanguageSelection'));
const Home = lazy(() => import('@/pages/Home'));
const MarketPrices = lazy(() => import('@/pages/MarketPrices'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Signup = lazy(() => import('@/pages/auth/Signup'));
const RegisterRole = lazy(() => import('@/pages/auth/RegisterRole'));
const VerifyOTP = lazy(() => import('@/pages/auth/VerifyOTP'));
const RoleUnavailablePage = lazy(() => import('@/pages/common/RoleUnavailablePage'));

/* Household Pages */
const HouseholdDashboard = lazy(() =>
  import('@/pages/household/HouseholdDashboard').then((m) => ({ default: m.HouseholdDashboard }))
);
const HouseholdHistory = lazy(() =>
  import('@/pages/household/HouseholdHistory').then((m) => ({ default: m.HouseholdHistory }))
);
const HouseholdOrders = lazy(() =>
  import('@/pages/household/HouseholdOrders').then((m) => ({ default: m.HouseholdOrders }))
);
const HouseholdNotifications = lazy(() =>
  import('@/pages/household/HouseholdNotifications').then((m) => ({
    default: m.HouseholdNotifications,
  }))
);
const HouseholdProfile = lazy(() =>
  import('@/pages/household/HouseholdProfile').then((m) => ({ default: m.HouseholdProfile }))
);
const HouseholdRates = lazy(() =>
  import('@/pages/household/HouseholdRates').then((m) => ({
    default: m.HouseholdRates,
  }))
);
const HouseholdPostScrap = lazy(() =>
  import('@/pages/household/HouseholdPostScrap').then((m) => ({
    default: m.HouseholdPostScrap,
  }))
);
const HouseholdReferEarn = lazy(() =>
  import('@/pages/household/HouseholdReferEarn').then((m) => ({
    default: m.HouseholdReferEarn,
  }))
);
const HouseholdSupport = lazy(() =>
  import('@/pages/household/HouseholdSupport').then((m) => ({
    default: m.HouseholdSupport,
  }))
);
const HouseholdSupportBot = lazy(() =>
  import('@/pages/household/HouseholdSupportBot').then((m) => ({
    default: m.HouseholdSupportBot,
  }))
);
const HouseholdReusableProducts = lazy(() =>
  import('@/pages/household/HouseholdReusableProducts').then((m) => ({
    default: m.HouseholdReusableProducts,
  }))
);
const HouseholdProductDetail = lazy(() =>
  import('@/pages/household/HouseholdProductDetail').then((m) => ({
    default: m.HouseholdProductDetail,
  }))
);

/* Merchant Modern Pages */
const MerchantDashboard = lazy(() => import('@/pages/dashboard/MerchantDashboard'));
const MerchantRide = lazy(() => import('@/pages/merchant/MerchantRide'));
const MerchantRequests = lazy(() => import('@/pages/merchant/MerchantRequests'));
const MerchantOrders = lazy(() => import('@/pages/merchant/MerchantOrders'));
const MerchantQuotes = lazy(() => import('@/pages/merchant/MerchantQuotes'));
const MerchantTransactions = lazy(() => import('@/pages/merchant/MerchantTransactions'));
const MerchantReusableProducts = lazy(() => import('@/pages/merchant/MerchantReusableProducts'));
const MerchantProfile = lazy(() => import('@/pages/merchant/MerchantProfile'));
const MerchantMarketPrices = lazy(() => import('@/pages/merchant/MerchantMarketPrices'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Settings = lazy(() => import('@/pages/Settings'));

/* Industry B2B Portal Modern Pages */
import IndustryDashboard from '@/pages/industry/IndustryDashboard';
import IndustryMarketPrices from '@/pages/industry/IndustryMarketPrices';
import IndustryPostRequirement from '@/pages/industry/IndustryPostRequirement';
import IndustryMyRequests from '@/pages/industry/IndustryMyRequests';
import IndustryQuotesReceived from '@/pages/industry/IndustryQuotesReceived';
import IndustryOrders from '@/pages/industry/IndustryOrders';
import IndustryTransactions from '@/pages/industry/IndustryTransactions';
import IndustryProfile from '@/pages/industry/IndustryProfile';

import { useAuthStore } from '@/store/useAuthStore';

function RootRedirect() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;

  if (isAuthenticated && user?.role) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <Splash />;
}

function FallbackRedirect() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;

  if (isAuthenticated && user?.role) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <Navigate to="/home" replace />;
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner text="Loading..." />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <SuspenseWrap>
      <Routes>
        {/* Public Marketing & Informational Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/market-prices" element={<MarketPrices />} />
        <Route path="/public-market-prices" element={<MarketPrices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterRole />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/aggregator" element={<Navigate to="/home" replace />} />
        <Route path="/dashboard/aggregator" element={<Navigate to="/home" replace />} />

        {/* ================================================================
            Household Dedicated Portal Shell (Graphite Sidebar + Top Header)
           ================================================================ */}
        <Route element={<ProtectedRoute><HouseholdLayout /></ProtectedRoute>}>
          <Route path="/household" element={<HouseholdDashboard />} />
          <Route path="/dashboard/household" element={<HouseholdDashboard />} />
          <Route path="/household/home" element={<HouseholdDashboard />} />
          <Route path="/household/rates" element={<HouseholdRates />} />
          <Route path="/household/market-prices" element={<HouseholdRates />} />
          <Route path="/household/post-scrap" element={<HouseholdPostScrap />} />
          <Route path="/household/history" element={<HouseholdHistory />} />
          <Route path="/household/orders" element={<HouseholdOrders />} />
          <Route path="/household/products" element={<HouseholdReusableProducts />} />
          <Route path="/household/reusable-products" element={<HouseholdReusableProducts />} />
          <Route path="/household/products/:id" element={<HouseholdProductDetail />} />
          <Route path="/household/notifications" element={<HouseholdNotifications />} />
          <Route path="/household/profile" element={<HouseholdProfile />} />
          <Route path="/household/refer-earn" element={<HouseholdReferEarn />} />
          <Route path="/household/refer" element={<HouseholdReferEarn />} />
          <Route path="/household/support" element={<HouseholdSupport />} />
          <Route path="/household/help" element={<HouseholdSupport />} />
          <Route path="/household/support/bot" element={<HouseholdSupportBot />} />
          <Route path="/household/bot" element={<HouseholdSupportBot />} />
        </Route>

        {/* ================================================================
            Merchant Dedicated Layout Shell (Sidebar + Slim Top Header)
           ================================================================ */}
        <Route element={<ProtectedRoute><MerchantLayout /></ProtectedRoute>}>
          {/* Dashboard */}
          <Route path="/dashboard/merchant" element={<MerchantDashboard />} />
          <Route path="/merchant" element={<MerchantDashboard />} />
          <Route path="/app" element={<Navigate to="/dashboard/merchant" replace />} />
          <Route path="/app/home" element={<Navigate to="/dashboard/merchant" replace />} />

          {/* Market Prices & Merchant Buying Rates */}
          <Route path="/merchant/market-prices" element={<MerchantMarketPrices />} />
          <Route path="/dashboard/merchant/market-prices" element={<MerchantMarketPrices />} />
          <Route path="/app/market-prices" element={<MerchantMarketPrices />} />

          {/* Ride / Pickups */}
          <Route path="/ride" element={<MerchantRide />} />
          <Route path="/dashboard/merchant/ride" element={<MerchantRide />} />
          <Route path="/app/ride" element={<MerchantRide />} />

          {/* Requests */}
          <Route path="/requests" element={<MerchantRequests />} />
          <Route path="/dashboard/merchant/requests" element={<MerchantRequests />} />
          <Route path="/app/requests" element={<MerchantRequests />} />

          {/* Orders */}
          <Route path="/orders" element={<MerchantOrders />} />
          <Route path="/dashboard/merchant/orders" element={<MerchantOrders />} />
          <Route path="/app/orders" element={<MerchantOrders />} />
          <Route path="/app/track" element={<Navigate to="/orders" replace />} />

          {/* Quotes */}
          <Route path="/quotes" element={<MerchantQuotes />} />
          <Route path="/merchant-offers" element={<MerchantQuotes />} />
          <Route path="/dashboard/merchant/quotes" element={<MerchantQuotes />} />
          <Route path="/app/quotes" element={<MerchantQuotes />} />

          {/* Transactions */}
          <Route path="/transactions" element={<MerchantTransactions />} />
          <Route path="/dashboard/merchant/transactions" element={<MerchantTransactions />} />
          <Route path="/app/transactions" element={<MerchantTransactions />} />

          {/* Reusable Products / Marketplace */}
          <Route path="/reusable-products" element={<MerchantReusableProducts />} />
          <Route path="/marketplace" element={<MerchantReusableProducts />} />
          <Route path="/dashboard/merchant/reusable-products" element={<MerchantReusableProducts />} />
          <Route path="/app/reusable-products" element={<MerchantReusableProducts />} />
          <Route path="/sell-scrap" element={<Navigate to="/reusable-products" replace />} />
          <Route path="/app/post" element={<Navigate to="/reusable-products" replace />} />

          {/* Profile */}
          <Route path="/profile" element={<MerchantProfile />} />
          <Route path="/dashboard/merchant/profile" element={<MerchantProfile />} />
          <Route path="/app/profile" element={<MerchantProfile />} />

          {/* Notifications */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dashboard/merchant/notifications" element={<Notifications />} />
          <Route path="/app/notifications" element={<Notifications />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard/merchant/settings" element={<Settings />} />
          <Route path="/app/settings" element={<Settings />} />
        </Route>

        {/* ================================================================
            Industry Dedicated Layout Shell (Sidebar + Slim Top Header)
           ================================================================ */}
        <Route element={<ProtectedRoute><IndustryLayout /></ProtectedRoute>}>
          {/* Dashboard */}
          <Route path="/industry" element={<IndustryDashboard />} />
          <Route path="/industry/dashboard" element={<IndustryDashboard />} />
          <Route path="/dashboard/industry" element={<IndustryDashboard />} />

          {/* Market Prices */}
          <Route path="/industry/market-prices" element={<IndustryMarketPrices />} />

          {/* Post Requirement 5-Step Flow */}
          <Route path="/industry/post-requirement" element={<IndustryPostRequirement />} />
          <Route path="/industry/post" element={<Navigate to="/industry/post-requirement" replace />} />

          {/* My Requests */}
          <Route path="/industry/requests" element={<IndustryMyRequests />} />
          <Route path="/industry/my-requests" element={<IndustryMyRequests />} />

          {/* Quotes Received */}
          <Route path="/industry/quotes" element={<IndustryQuotesReceived />} />
          <Route path="/industry/quotes-received" element={<IndustryQuotesReceived />} />

          {/* Orders */}
          <Route path="/industry/orders" element={<IndustryOrders />} />

          {/* Transactions */}
          <Route path="/industry/transactions" element={<IndustryTransactions />} />

          {/* Profile */}
          <Route path="/industry/profile" element={<IndustryProfile />} />
        </Route>

        {/* Catch-all: Route back to user role dashboard if authenticated, or Home if visitor */}
        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </SuspenseWrap>
  );
}
