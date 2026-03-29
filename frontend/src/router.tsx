import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import CommunityPropertyOnboardingPage from './pages/CommunityPropertyOnboardingPage'
import EditProfilePage from './pages/EditProfilePage'
import HomePage from './pages/HomePage'
import HostDashboardPage from './pages/HostDashboardPage'
import HostOnboardingPage from './pages/HostOnboardingPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/loginPage'
import ProfilePage from './pages/ProfilePage'
import PropertyDetails from './pages/PropertyDetails'
import ResetPasswordPage from './pages/ResetPasswordPage'
import RulesPage from './pages/RulesPage'
import SignUpPage from './pages/SignUpPage'
import UrgentStopPage from './pages/UrgentStopPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'landing',
        element: <LandingPage />,
      },
      {
        path: 'community/onboarding',
        element: <CommunityPropertyOnboardingPage />,
      },
      {
        path: 'host/onboarding',
        element: <HostOnboardingPage />,
      },
      {
        path: 'host/dashboard',
        element: <HostDashboardPage />,
      },
      {
        path: 'properties/:propertyId',
        element: <PropertyDetails />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'profile/:userId',
        element: <ProfilePage />,
      },
      {
        path: 'profile/:userId/edit',
        element: <EditProfilePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'rules',
        element: <RulesPage />,
      },
      {
        path: 'urgent-stop',
        element: <UrgentStopPage />,
      },
    ],
  },
])
