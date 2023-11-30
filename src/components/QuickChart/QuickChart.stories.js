import QuickChart from './QuickChart.jsx';

const domainKey = require('./domainKey.js').default;

export default {
  title: 'Design System/QuickChart',
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
