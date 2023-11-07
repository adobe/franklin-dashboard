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

loadCSS("/styles/spectrum-css/vars/dist/spectrum-global.css");
loadCSS("/styles/spectrum-css/vars/dist/spectrum-medium.css");
loadCSS("/styles/spectrum-css/vars/dist/spectrum-light.css");
loadCSS("/styles/spectrum-css/page/dist/index-vars.css");
loadCSS("/styles/spectrum-css/button/dist/index-vars.css");
loadCSS("/styles/spectrum-css/table/dist/index-vars.css");
loadCSS("/styles/spectrum-css/progressbar/dist/index-vars.css");
loadCSS("/styles/spectrum-css/badge/dist/index-vars.css");

loadScript('/scripts/loadicons/index.js', 'text/javascript');
loadScript('', 'text/javascript').textContent = `  loadIcons('/styles/spectrum-css/icon/dist/spectrum-css-icons.svg');`