import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts (eager - needed immediately)
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Feature pages (lazy loaded)
const VenueList    = lazy(() => import('../features/venues/VenueList'));
const VenueDetail  = lazy(() => import('../features/venues/VenueDetail'));
const MatchFeed    = lazy(() => import('../features/community/MatchFeed'));
const DesignSystemDemo = lazy(() => import('../pages/demo/DesignSystemDemo'));

// Loading fallback
const PageLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="w-6 h-6 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
  </div>
);

export const router = createBrowserRouter([
  // ── Public routes (with top navbar) ──────────────────────────
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,                element: <Navigate to="/venues" replace /> },
      { path: 'venues',             element: <Suspense fallback={<PageLoader />}><VenueList /></Suspense> },
      { path: 'venues/:id',         element: <Suspense fallback={<PageLoader />}><VenueDetail /></Suspense> },
      { path: 'community',          element: <Suspense fallback={<PageLoader />}><MatchFeed /></Suspense> },
    ],
  },

  // ── Auth routes (no navbar) ────────────────────────────────────
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ── Design system demo (dev only) ──────────────────────────────
  {
    path: '/design-system',
    element: <Suspense fallback={<PageLoader />}><DesignSystemDemo /></Suspense>,
  },
]);
