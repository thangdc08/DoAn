import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Public Pages
const HomePage = lazy(() => import('../pages/public/HomePage'));
const VenueListPage = lazy(() => import('../pages/public/VenueListPage'));
const VenueDetailPage = lazy(() => import('../pages/public/VenueDetailPage'));
const JoinPartnerPage = lazy(() => import('../pages/public/JoinPartnerPage'));
const PartnerOnboardingPage = lazy(() => import('../pages/public/PartnerOnboardingPage'));
const CommunityPage = lazy(() => import('../pages/public/CommunityPage'));
const MatchDetailPage = lazy(() => import('../pages/public/MatchDetailPage'));
const VenueMapPage = lazy(() => import('../pages/public/VenueMapPage'));
const PricingPage = lazy(() => import('../pages/public/PricingPage'));
const AboutPage = lazy(() => import('../pages/public/AboutPage'));

// User Pages
const ProfilePage = lazy(() => import('../pages/user/ProfilePage'));
const BookingPage = lazy(() => import('../pages/user/BookingPage'));
const CheckoutPage = lazy(() => import('../pages/user/CheckoutPage'));
const PaymentPage = lazy(() => import('../pages/user/PaymentPage'));
const MockPaymentPage = lazy(() => import('../pages/user/MockPaymentPage'));
const PaymentResultPage = lazy(() => import('../pages/user/PaymentResultPage'));
const BookingHistoryPage = lazy(() => import('../pages/user/BookingHistoryPage'));
const UserDashboardPage = lazy(() => import('../pages/user/UserDashboardPage'));
const UserChallengesPage = lazy(() => import('../pages/user/UserChallengesPage'));
const UserSettingsPage = lazy(() => import('../pages/user/UserSettingsPage'));
const CreateMatchPage = lazy(() => import('../pages/user/CreateMatchPage'));
const MyMatchesPage = lazy(() => import('../pages/user/MyMatchesPage'));
const ChatPage = lazy(() => import('../pages/user/ChatPage'));
const SelectedMatchesPage = lazy(() => import('../pages/user/SelectedMatchesPage'));
const FavoriteMatchesPage = lazy(() => import('../pages/user/FavoriteMatchesPage'));

// Owner Pages
const OwnerDashboardPage = lazy(() => import('../pages/owner/OwnerDashboardPage'));
const VenueManagementPage = lazy(() => import('../pages/owner/VenueManagementPage'));
const CourtManagementPage = lazy(() => import('../pages/owner/CourtManagementPage'));
const OwnerBookingPage = lazy(() => import('../pages/owner/OwnerBookingPage'));
const OwnerRevenuePage = lazy(() => import('../pages/owner/OwnerRevenuePage'));
const OwnerSettingsPage = lazy(() => import('../pages/owner/OwnerSettingsPage'));
const OwnerSupportPage = lazy(() => import('../pages/owner/OwnerSupportPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'));
const VenueApprovalPage = lazy(() => import('../pages/admin/VenueApprovalPage'));
const AdminReportPage = lazy(() => import('../pages/admin/AdminReportPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));
const AdminSupportPage = lazy(() => import('../pages/admin/AdminSupportPage'));

// Loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <Spin size="large" />
  </div>
);

export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'venues', element: <Suspense fallback={<PageLoader />}><VenueListPage /></Suspense> },
      { path: 'venues/:venueId', element: <Suspense fallback={<PageLoader />}><VenueDetailPage /></Suspense> },
      { path: 'community', element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: 'community/matches/:matchId', element: <Suspense fallback={<PageLoader />}><MatchDetailPage /></Suspense> },
      { path: 'map', element: <Suspense fallback={<PageLoader />}><VenueMapPage /></Suspense> },
      { path: 'pricing', element: <Suspense fallback={<PageLoader />}><PricingPage /></Suspense> },
      { path: 'about', element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: 'partner', element: <Suspense fallback={<PageLoader />}><JoinPartnerPage /></Suspense> },
      { path: 'partner/register', element: <Suspense fallback={<PageLoader />}><PartnerOnboardingPage /></Suspense> },
      { path: 'booking', element: <Suspense fallback={<PageLoader />}><BookingPage /></Suspense> },
      { path: 'checkout', element: <Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense> },
      { path: 'payment', element: <Suspense fallback={<PageLoader />}><PaymentPage /></Suspense> },
      { path: 'payment-result', element: <Suspense fallback={<PageLoader />}><PaymentResultPage /></Suspense> },
      { path: 'selected-matches', element: <Suspense fallback={<PageLoader />}><SelectedMatchesPage /></Suspense> },
      { path: 'favorites', element: <Suspense fallback={<PageLoader />}><FavoriteMatchesPage /></Suspense> },
      { path: 'chat', element: <Suspense fallback={<PageLoader />}><ChatPage /></Suspense> },
    ],
  },

  // ── Auth routes ────────────────────────────────────
  {
    path: '/',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },

  // ── User routes ────────────────────────────────────
  {
    path: '/user',
    element: <DashboardLayout role="USER" />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><UserDashboardPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><UserDashboardPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
      { path: 'bookings', element: <Suspense fallback={<PageLoader />}><BookingHistoryPage /></Suspense> },
      { path: 'matches', element: <Suspense fallback={<PageLoader />}><MyMatchesPage /></Suspense> },
      { path: 'create-match', element: <Suspense fallback={<PageLoader />}><CreateMatchPage /></Suspense> },
      { path: 'challenges', element: <Suspense fallback={<PageLoader />}><UserChallengesPage /></Suspense> },
      { path: 'challenges/create', element: <Suspense fallback={<PageLoader />}><CreateMatchPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><UserSettingsPage /></Suspense> },
    ],
  },

  // ── Mock Payment (standalone) ──────────────────────
  { path: '/mock-payment', element: <Suspense fallback={<PageLoader />}><MockPaymentPage /></Suspense> },

  // ── Owner routes ───────────────────────────────────
  {
    path: '/owner',
    element: <DashboardLayout role="OWNER" />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><OwnerDashboardPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><OwnerDashboardPage /></Suspense> },
      { path: 'venues', element: <Suspense fallback={<PageLoader />}><VenueManagementPage /></Suspense> },
      { path: 'venues/:venueId/courts', element: <Suspense fallback={<PageLoader />}><CourtManagementPage /></Suspense> },
      { path: 'bookings', element: <Suspense fallback={<PageLoader />}><OwnerBookingPage /></Suspense> },
      { path: 'chat', element: <Suspense fallback={<PageLoader />}><ChatPage /></Suspense> },
      { path: 'revenue', element: <Suspense fallback={<PageLoader />}><OwnerRevenuePage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><OwnerSettingsPage /></Suspense> },
      { path: 'support', element: <Suspense fallback={<PageLoader />}><OwnerSupportPage /></Suspense> },
    ],
  },

  // ── Admin routes ───────────────────────────────────
  {
    path: '/admin',
    element: <DashboardLayout role="ADMIN" />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense> },
      { path: 'users', element: <Suspense fallback={<PageLoader />}><UserManagementPage /></Suspense> },
      { path: 'venues', element: <Suspense fallback={<PageLoader />}><VenueApprovalPage /></Suspense> },
      { path: 'reports', element: <Suspense fallback={<PageLoader />}><AdminReportPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><AdminSettingsPage /></Suspense> },
      { path: 'support', element: <Suspense fallback={<PageLoader />}><AdminSupportPage /></Suspense> },
    ],
  },
]);
