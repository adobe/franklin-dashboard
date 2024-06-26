import { Provider, defaultTheme } from '@adobe/react-spectrum';
import Layout from './Layout.jsx';

export default {
  title: 'Design System/Core/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const layoutDefault = () => (
    <Provider theme={defaultTheme} colorScheme='light'>
        <Layout />
    </Provider>
);
