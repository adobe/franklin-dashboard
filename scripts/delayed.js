/* eslint-disable import/no-cycle */
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const echartScript = document.createElement('script');
echartScript.type = 'text/javascript';
echartScript.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js';
document.head.appendChild(echartScript);