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

  const currentpage = new URL(window.location.href);
  const params = currentpage.searchParams;
  const currURL = params.get('url') || null;
  const hostname = currURL ? new URL(currURL.startsWith('https://') ? currURL : "https://"+currURL).hostname : ''
  const domainkey = params.get('domainkey') || hostname ? localStorage.getItem(hostname) : '';

  params.set('url', hostname);
  params.set('domainkey', domainkey);

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

  const makeList = () => {
        if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
            window.setTimeout(makeList, 1000);
        } else if (Object.hasOwn(window, flag) && window[flag] === false) {
            // query complete, hide loading graphic
            const { hostname, pageviews } = window.dashboard[endpoint].results.data[0];

            hideLoader(block);
            const pageViewDiv = document.createElement('div');
            const pageViewLabel = document.createElement('div');
            const pageViewNumb = document.createElement('div');
            pageViewDiv.className = "spectrum-Badge spectrum-Badge--sizeM spectrum-Badge--gray";
            pageViewLabel.className = "spectrum-Badge-label pvLabel";
            pageViewNumb.className = "spectrum-Badge-label pvNumb";
            pageViewLabel.innerHTML = `<h5>Your Site:</h5> ${hostname}`;
            pageViewNumb.innerHTML = `<h5>Site Visits:</h5> ${pageviews}`;
            pageViewDiv.appendChild(pageViewLabel);
            pageViewDiv.appendChild(pageViewNumb);
            block.append(pageViewDiv)
        }    
    }   

    getQuery();
    makeList();
}