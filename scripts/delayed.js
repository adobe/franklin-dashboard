/* eslint-disable import/no-cycle */
import { sampleRUM, getMetadata, loadCSS } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const loadScript = (src, type) => {
  const thisScript = document.createElement('script');
  thisScript.type = type;
  thisScript.src = src;
  document.head.appendChild(thisScript);
  return thisScript;
}

// load echarts library unless the page metadata says otherwise
if (getMetadata('echarts') !== 'false') {
  loadScript('https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js', 'text/javascript');
}

loadScript('/node_modules/loadicons/index.js', 'text/javascript');
loadScript('', 'text/javascript').textContent = `  loadIcons('/node_modules/@spectrum-css/icon/dist/spectrum-css-icons.svg');`

const html = document.querySelector('html');
html.className = "spectrum spectrum--medium spectrum--light"