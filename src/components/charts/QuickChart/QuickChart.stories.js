import QuickChart from './QuickChart.jsx';
// eslint-disable-next-line import/no-unresolved
import domainKey from './domainKey.js';

export default {
  title: 'Design System/Charts/QuickChart',
  component: QuickChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const aemdotlive = {
  args: {
    url: 'www.aem.live',
    domainKey,
  },
};

export const adobedotcom = {
  args: {
    url: 'www.adobe.com',
    domainKey,
  },
};
