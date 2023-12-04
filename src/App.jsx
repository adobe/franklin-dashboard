import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,

} from 'react-router-dom';

import './App.css';

import DashboardDataDeskLanding from './components/views/DashboardDataDeskLanding.jsx';
import Dashboard404Report from './components/views/Dashboard404Report.jsx';
import DashboardRumView from './components/views/DashboardRUMView.jsx';
import DashboardSidekickView from './components/views/DashboardSidekickView.jsx';

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
]);

const App = () => <RouterProvider router={router} />;

export default App;
