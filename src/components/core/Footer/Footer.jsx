import { Footer, Provider, defaultTheme } from '@adobe/react-spectrum';

const DashboardFooter = ({
  children = `Copyright © ${new Date().getFullYear()} Adobe. All rights reserved.`,
}) => (
    <Provider theme={defaultTheme}>
        <Footer minHeight="50px">
            {children}
        </Footer>
    </Provider>

);

export default DashboardFooter;
