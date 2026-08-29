import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common';
import { MerchantLayout } from '@/layouts/MerchantLayout';
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

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner text="Loading..." />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <SuspenseWrap>
      <Routes>
        {/* Public Marketing & Informational Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/public-market-prices" element={<MarketPrices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterRole />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Merchant Dedicated Layout Shell (Sidebar + Slim Top Header) */}
        <Route element={<ProtectedRoute><MerchantLayout /></ProtectedRoute>}>
          {/* Dashboard */}
          <Route path="/dashboard/merchant" element={<MerchantDashboard />} />
          <Route path="/merchant" element={<MerchantDashboard />} />
          <Route path="/app" element={<Navigate to="/dashboard/merchant" replace />} />
          <Route path="/app/home" element={<Navigate to="/dashboard/merchant" replace />} />

          {/* Market Prices & Merchant Buying Rates */}
          <Route path="/market-prices" element={<MerchantMarketPrices />} />
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

        {/* Catch-all: Route back to Merchant Dashboard if authenticated or Home */}
        <Route path="*" element={<Navigate to="/dashboard/merchant" replace />} />
      </Routes>
    </SuspenseWrap>
  );
}
