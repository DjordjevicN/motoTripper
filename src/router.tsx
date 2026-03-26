import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { AppPage } from '@/pages/app-page'
import { HomePage } from '@/pages/home-page'

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
        path: 'app',
        element: <AppPage />,
      },
    ],
  },
])
