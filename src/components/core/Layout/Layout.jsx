import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore, initializeStoreFromLocalStorage } from '../../../stores/global.js';
import DashboardNavbar from '../Navbar/Navbar.jsx';
import DashboardFooter from '../Footer/Footer.jsx';

const DashboardLayout = ({
  children,
  hasNavigation = true,
  data,
}) => {
  let navigate = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  const {
    domainKey,
  } = useStore();

  useEffect(() => {
    initializeStoreFromLocalStorage();

    if (window.location.pathname !== '/' && (localStorage.getItem('domainKey') === undefined || localStorage.getItem('domainKey') === null)) {
      navigate('/');
    } else if (window.location.pathname === '/' && localStorage.getItem('domainKey') !== null) {
      navigate('/rum-dashboard');
    }
  }, [navigate, domainKey, data]);

  return (
    <Provider theme={defaultTheme} colorScheme='light' minHeight="100vh">
      <DashboardNavbar hasNavigation={hasNavigation} />
        {children}
      <DashboardFooter />
    </Provider>
  );
};

export default DashboardLayout;
