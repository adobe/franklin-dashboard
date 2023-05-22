// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

const ECHARTS = 'https://cdn.jsdelivr.net/npm/echarts@5.0/dist/echarts.min.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// function createInlineScriptHTML(innerHTML, parent) {
//   const script = document.createElement('script');
//   script.type = 'text/partytown';
//   script.innerHTML = innerHTML;
//   parent.appendChild(script);
// }

function createInlineScriptSrc(src, parent) {
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.src = src;
  parent.appendChild(script);
}

createInlineScriptSrc(ECHARTS, document.head);

window.partytown = {
  lib: '/scripts/',
};
import('./partytown.js');
