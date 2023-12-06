import DashboardNavbar from '../Navbar/Navbar.jsx';
import DashboardFooter from '../Footer/Footer.jsx';

const LandingLayout = ({
  children,
}) => (
    <DashboardNavbar hasNavigation={false} />
      {children}
    <DashboardFooter />
);

export default LandingLayout;
