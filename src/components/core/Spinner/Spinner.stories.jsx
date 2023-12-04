import Spinner from './Spinner.jsx';

export default {
  title: 'Design System/Core/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const spinnerLoadingDefault = {
  args: {},
};

export const spinnerLoadingWithParam = {
  args: {
    loading: true,
  },
};

export const spinnerLoaded = {
  args: {
    loading: false,
    children: 'Loaded',
  },
};
