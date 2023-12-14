import { Footer } from '@adobe/react-spectrum';

const DashboardFooter = ({
  children = `Copyright © ${new Date().getFullYear()} Adobe. All rights reserved.`,
}) => (
    <Footer minHeight="100px" marginTop="single-line-height" position="relative" UNSAFE_style={{
      bottom: '0px',
      textAlign: 'center',
    }}>
      <br />
        {children}
    </Footer>

);

export default DashboardFooter;
