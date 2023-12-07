import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { Provider, defaultTheme } from '@adobe/react-spectrum';

import DashboardDataDeskLanding from './components/views/DashboardDataDeskLanding.jsx';
import Dashboard404Report from './components/views/Dashboard404Report.jsx';
import DashboardRumView from './components/views/DashboardRUMView.jsx';
import DashboardSidekickView from './components/views/DashboardSidekickView.jsx';
import DashboardRUMPerformanceMonitor from './components/views/DashboardRUMPerformanceMonitor/DashboardRUMPerformanceMonitor.jsx';

import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardDataDeskLanding />,
  },
  {
    path: '404-reports',
    element: <Dashboard404Report />,
  },
  {
    path: 'rum-dashboard',
    element: <DashboardRumView />,
  },
  {
    path: 'sidekick-dashboard',
    element: <DashboardSidekickView />,
  },
  {
    path: 'rum-performance-monitor',
    element: <DashboardRUMPerformanceMonitor />,
  },
]);

const App = () => (
  <Provider theme={defaultTheme} colorScheme='light'>
    <RouterProvider router={router} />
  </Provider>
);

export default App;
