import { Provider, defaultTheme } from '@adobe/react-spectrum';
import DashboardNavbar from '../Navbar/Navbar.jsx';
import DashboardFooter from '../Footer/Footer.jsx';

const DashboardLayout = ({
  children,
}) => (
    <Provider theme={defaultTheme}>
        <DashboardNavbar />
        {children}
        <DashboardFooter />
    </Provider>
);

export default DashboardLayout;
