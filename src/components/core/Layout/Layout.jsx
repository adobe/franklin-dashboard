import DashboardNavbar from '../Navbar/Navbar.jsx';
import DashboardFooter from '../Footer/Footer.jsx';

const DashboardLayout = ({
  children,
}) => (
    <>
        <DashboardNavbar />
        {children}
        <DashboardFooter />
    </>
);

export default DashboardLayout;
