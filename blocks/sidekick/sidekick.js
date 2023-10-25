import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getQueryInfo, queryRequest, getUrlBase } from '../../scripts/scripts.js';
import { drawLoader, hideLoader } from '../../scripts/loader.js';

export default function decorate(block) {
  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const endpoint = cfg.data;

  cfg.block = block;
  const flag = `${endpoint}Flag`;

  // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.style.display = 'none';
  });

  let makeList;

  const getQuery = () => {
    if (!Object.hasOwn(window, 'gettingQueryInfo')) {
      getQueryInfo();
    }
    if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === true) {
      window.setTimeout(getQuery, 1);
    } else if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === false) {
      setTimeout(() => {
        queryRequest(endpoint, getUrlBase(endpoint));
      }, 3000);

      drawLoader(block);
    }
  };

  const truncateFloat = (metric) => {
    const numb = parseFloat(metric).toFixed(2).toLocaleString('en-US');
    const displayedNumb = numb.endsWith('.00') ? numb.replace('.00', '') : numb;
    return displayedNumb;
  }

  const toggleColor = (metric, range, el) => {
    if (metric && metric <= range[0]) {
      el.classList.toggle('pass');
    } else if (
      metric > range[0] && metric < range[1]
    ) {
      el.classList.toggle('okay');
    } else if (!metric) {
      el.classList.toggle('noresult');
      chartFlag = false;
    } else {
      el.classList.toggle('fail');
    }
  }

  const createMetricDiv = (metric, col, measurement, range, title) => {
    const metricEl = document.createElement('div');
    metricEl.classList.add('metric', 'group')
    const metricTitle = document.createElement('div');
    const metricNumb = document.createElement('div');
    metricTitle.classList.add(col, 'title');
    metricTitle.textContent = title;
    metricNumb.classList.add(col, 'metric', 'numeric');
    metricNumb.textContent = metric ? `${col === 'avglcp' ? truncateFloat(metric / 1000.00) : truncateFloat(metric)}${measurement}` : 'N/A'
    toggleColor(metric, range, metricNumb)
    metricEl.appendChild(metricTitle);
    metricEl.appendChild(metricNumb);
    return metricEl;
  }

  if (endpoint === 'rum-dashboard'){
    makeList = () => {
      if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
        window.setTimeout(makeList, 1000);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
        // query complete, hide loading graphic
        const { data } = window.dashboard[endpoint].results;
        hideLoader(block);

        if (data.length === 0) {
          const noresults = document.createElement('p');
          const params = new URLSearchParams(window.location.search);
          if (params.has('domainkey') && params.has('url')) {
            noresults.textContent = 'No Core Web Vital Info Available.';
          } else {
            noresults.innerHTML = '<i>domainkey</i> and <i>url</i> (hostname) are required.  Please provide <a href="/">here</a>.';
          }
          block.append(noresults);
        }
        else{
          const { url, pageviews } = data[0];
          const cols = [ 'avglcp', 'avgcls', 'avginp'];
          const metrics = { avglcp: 's', avgcls:'', avgfid: 'ms', avginp: 'ms' };
          const titles = {avglcp: 'LCP', avgcls: 'CLS', avgfid: 'FID', avginp: 'INP'};
          const ranges = {
            avglcp: [2500, 4000],
            avgfid: [100, 300],
            avginp: [200, 500],
            avgcls: [0.1, 0.25],
          };
          
          const urlEl = document.createElement('div');
          urlEl.classList.add('url', 'info', 'txt');
          const heading = document.createElement('h4');
          heading.textContent = `30 Day Stats Summary`;
          urlEl.appendChild(heading);
  
          const cwvEl = document.createElement('div');
          cwvEl.classList.add('cwv', 'group');
  
          const pvEl = document.createElement('div');
          const pvTitle = document.createElement('h5');
          pvTitle.textContent = 'Page Views';
          const pvNumb = document.createElement('div');
          pvNumb.classList.add('pv', 'metric', 'numeric');
          pvNumb.textContent = parseInt(pageviews, 10).toLocaleString('en-US');
          urlEl.appendChild(pvTitle);
          urlEl.appendChild(pvNumb);
  
          for(let i = 0; i < cols.length; i++){
            //create sub elements of this div
            const retEl = createMetricDiv(data[0][cols[i]], cols[i], metrics[cols[i]], ranges[cols[i]], titles[cols[i]]);
            cwvEl.appendChild(retEl);
          }
  
          block.append(urlEl);
          block.append(pvEl);
          block.append(cwvEl);
        }
      }
    };
  }

  getQuery();
  makeList();
}
