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

loadCSS("/styles/node_modules/@spectrum-css/vars/dist/spectrum-global.css")
loadCSS("/styles/node_modules/@spectrum-css/vars/dist/spectrum-global.css")
loadCSS("/styles/node_modules/@spectrum-css/vars/dist/spectrum-medium.css")
loadCSS("/styles/node_modules/@spectrum-css/vars/dist/spectrum-light.css")
loadCSS("/styles/node_modules/@spectrum-css/page/dist/index-vars.css")
loadCSS("/styles/node_modules/@spectrum-css/button/dist/index-vars.css")
loadCSS("/styles/node_modules/@spectrum-css/table/dist/index-vars.css")
loadCSS("/styles/node_modules/@spectrum-css/progressbar/dist/index-vars.css");
loadCSS("/styles/node_modules/@spectrum-css/badge/dist/index-vars.css")
loadCSS("/styles/node_modules/@spectrum-css/accordion/dist/index-vars.css")

// load echarts library unless the page metadata says otherwise
if (getMetadata('echarts') !== 'false') {
  loadScript('https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js', 'text/javascript');
}

loadScript('/styles/node_modules/loadicons/index.js', 'text/javascript');
loadScript('', 'text/javascript').textContent = `  loadIcons('/styles/node_modules/@spectrum-css/icon/dist/spectrum-css-icons.svg');`

const html = document.querySelector('html');
html.className = "spectrum spectrum--medium spectrum--light"