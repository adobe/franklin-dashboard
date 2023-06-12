// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const main = document.querySelector('main');
//await getQueryInfo().then(() => bulkQueryRequest(main));
function createInlineScriptSrc(src, parent) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  parent.appendChild(script);
}
const ECHARTS = 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js';

createInlineScriptSrc(ECHARTS, document.head);
