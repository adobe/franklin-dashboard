import { Footer } from '@adobe/react-spectrum';

const DashboardFooter = ({
  children = `Copyright © ${new Date().getFullYear()} Adobe. All rights reserved.`,
}) => (
    <Footer minHeight="50px">
        {children}
    </Footer>

);

export default DashboardFooter;
