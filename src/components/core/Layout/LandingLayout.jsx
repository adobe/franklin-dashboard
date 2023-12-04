import { Provider, defaultTheme } from '@adobe/react-spectrum';
import DashboardNavbar from '../Navbar/Navbar.jsx';
import DashboardFooter from '../Footer/Footer.jsx';

const LandingLayout = ({
  children,
}) => (
    <Provider theme={defaultTheme}>
        <DashboardNavbar hasNavigation={false} />
        {children}
        <DashboardFooter />
    </Provider>
);

export default LandingLayout;
