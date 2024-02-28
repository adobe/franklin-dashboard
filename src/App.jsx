import {
  useNavigate,
  Route,
  Routes,
} from 'react-router-dom';

import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';

import DashboardDataDeskLanding from './components/views/DashboardDataDeskLanding/DashboardDataDeskLanding.jsx';
import Dashboard404Report from './components/views/Dashboard404Report/Dashboard404Report.jsx';
import DashboardRumView from './components/views/FormsDashboardRUMView/DashboardRUMView.jsx';
import DashboardRUMPerformanceMonitor from './components/views/DashboardRUMPerformanceMonitor/DashboardRUMPerformanceMonitor.jsx';

import './App.css';

async function App() {
  const navigate = useNavigate();

  return (
    <Provider theme={defaultTheme} colorScheme='light' router={{ navigate }}>
        <Routes>
          <Route path='/' element={<DashboardDataDeskLanding/>} index></Route>
          <Route path='/rum-dashboard' element={<DashboardRumView/>}></Route>
        </Routes>
        <ToastContainer />
    </Provider>
  );
}

export default App;
