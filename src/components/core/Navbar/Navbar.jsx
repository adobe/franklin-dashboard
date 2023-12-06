import NavigationTabs from './NavigationTabs.jsx';
import NavbarLogo from './NavbarLogo.jsx';

const DashboardNavbar = ({
  hasNavigation = true,
}) => (
    <div style={{ padding: '1.5em', display: 'flex' }}
    >
        <NavbarLogo />
        {hasNavigation && <NavigationTabs />}
    </div>
);

export default DashboardNavbar;
