/* eslint-disable import/no-cycle */
import { sampleRUM, getMetadata } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// load echarts library unless the page metadata says otherwise
// TODO switch logic so echarts is only shown when metadata value is true
// TODO requires change to relevant page metadata
if (getMetadata('echarts') !== 'false' || getMetadata('echarts') === 'true') {
  const echartScript = document.createElement('script');
  echartScript.type = 'text/javascript';
  echartScript.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js';
  document.head.appendChild(echartScript);
}

// load jquery for tablesorter if the page metadata declares
if (getMetadata('jquery') === 'true') {
  const jqueryScript = document.createElement('script');
  jqueryScript.type = 'text/javascript';
  jqueryScript.src = 'https://code.jquery.com/jquery-3.7.0.min.js';
  document.head.appendChild(jqueryScript);

  // to prevent javascript race condition, load tablesorter only after jQuery loads
  const sorter = () => {
    if (typeof window.jQuery === 'undefined') {
      window.setTimeout(sorter, 5);
    } else {
      const sortScript = document.createElement('script');
      sortScript.type = 'text/javascript';
      sortScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js';
      document.head.appendChild(sortScript);
    }
  };
  sorter();

  const sortStyle = document.createElement('link');
  sortStyle.rel = 'stylesheet';
  sortStyle.href = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/css/theme.default.min.css';
  document.head.appendChild(sortStyle);
}
