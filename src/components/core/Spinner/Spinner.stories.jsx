import { Provider, defaultTheme } from '@adobe/react-spectrum';
import Spinner from './Spinner.jsx';

export default {
  title: 'Design System/Core/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const spinnerLoadingDefault = () => (
  <Provider theme={defaultTheme}>
    <Spinner />
  </Provider>
);

export const spinnerLoadingWithParam = () => (
  <Provider theme={defaultTheme}>
    <Spinner loading />
  </Provider>
);

export const spinnerLoaded = () => (
  <Provider theme={defaultTheme}>
    <Spinner loading={false}>
      <h1>Loaded!</h1>
    </Spinner>
  </Provider>
);
