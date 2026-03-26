import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import EditProfilePage from './pages/EditProfilePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/loginPage'
import ProfilePage from './pages/ProfilePage'
import PropertyDetails from './pages/PropertyDetails'
import ResetPasswordPage from './pages/ResetPasswordPage'
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
        path: 'urgent-stop',
        element: <UrgentStopPage />,
      },
    ],
  },
])
