import { Provider, defaultTheme } from '@adobe/react-spectrum';
import Footer from './Footer.jsx';

export default {
  title: 'Design System/Core/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const footerDefault = () => (
    <Provider theme={defaultTheme}>
        <Footer />
    </Provider>
);
