// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// load echarts
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js';
document.head.appendChild(script);
