import { Provider, defaultTheme } from '@adobe/react-spectrum';
import Navbar from './Navbar.jsx';

export default {
  title: 'Design System/Core/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const navbarDefault = () => (
    <Provider colorScheme='light' theme={defaultTheme}>
        <Navbar />
    </Provider>
);
