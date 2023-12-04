import { Provider, defaultTheme } from '@adobe/react-spectrum';
import NavigationTabs from './NavigationTabs.jsx';
import NavbarLogo from './NavbarLogo.jsx';

const DashboardNavbar = ({
  hasNavigation = true,
}) => (
    <Provider colorScheme="light" theme={defaultTheme}>
    <div style={{ padding: '1.5em', display: 'flex' }}
    >
        <NavbarLogo />
        {hasNavigation && <NavigationTabs />}
    </div>
    </Provider>
);

export default DashboardNavbar;
