/* eslint-disable import/no-cycle */
import { sampleRUM, getMetadata } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// load echarts library unless the page metadata says otherwise
if (getMetadata('echarts') !== 'false') {
  const echartScript = document.createElement('script');
  echartScript.type = 'text/javascript';
  echartScript.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js';
  document.head.appendChild(echartScript);
}
