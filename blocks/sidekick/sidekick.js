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
      const { data } = window.dashboard[endpoint].results;
      hideLoader(block);

      const listGridContainer = document.createElement('div');
      listGridContainer.classList.add('grid', 'list', 'container');

      const cols = ['url', 'pageviews', 'avglcp', 'avgcls', 'avginp'];
      const metrics = ['s', '', 'ms'];
      const ranges = {
        avglcp: [2500, 4000],
        avgfid: [100, 300],
        avginp: [200, 500],
        avgcls: [0.1, 0.25],
      };

      const listGridHeadingRow = document.createElement('div');
      listGridHeadingRow.classList.add('grid', 'list', 'row', 'heading');
      for (let j = 0; j < 5; j += 1) {
        const listGridHeadings = document.createElement('div');
        if (cols[j] === 'url') {
          listGridHeadings.textContent = 'Path';
        } else if (cols[j] === 'pageviews') {
          listGridHeadings.textContent = 'Visits';
        } else if (cols[j] === 'avglcp') {
          listGridHeadings.textContent = 'LCP';
        } else if (cols[j] === 'avgcls') {
          listGridHeadings.textContent = 'CLS';
        } else if (cols[j] === 'avginp') {
          listGridHeadings.textContent = 'INP';
        } 
        listGridHeadings.classList.add('grid', 'list', 'col', 'heading');
        listGridHeadingRow.appendChild(listGridHeadings);
      }
      listGridContainer.append(listGridHeadingRow);


      let counter = 0;

      for (let i = 0; i < data.length; i += 1) {
        const listGridRow = document.createElement('div');
        listGridRow.classList.add('grid', 'list', 'row');
        if ((i % 2) === 1) {
          listGridRow.classList.add('odd');
        }

        for (let j = 0; j < 5; j += 1) {
          const listGridColumn = document.createElement('div');
          listGridColumn.classList.add('grid', 'list', 'col', cols[j]);

            let txtContent;
            if (cols[j] === 'avglcp') {
              txtContent = data[i][cols[j]] / 1000.00;
            } else if (cols[j] === 'url') {
              listGridColumn.innerHTML = `<a href='${data[i][cols[j]]}' target="_blank">${data[i][cols[j]].replace(/^https?:\/\/[^/]+/i, '')}</a>`;
            } else if (cols[j] === 'pageviews') {
              const params = new URLSearchParams(window.location.search);
              const nextUrl = data[i][cols[0]].replace('https://', '');
              params.set('url', nextUrl);
              listGridColumn.innerHTML = `<a href="/views/rum-pageviews?${params.toString()}">${parseInt(data[i][cols[j]], 10).toLocaleString('en-US')}</a>`;
            } else {
              txtContent = data[i][cols[j]];
            }
            if (j >= 2) {
              if (data[i][cols[j]] && data[i][cols[j]] <= ranges[cols[j]][0]) {
                listGridColumn.classList.toggle('pass');
              } else if (
                data[i][cols[j]] > ranges[cols[j]][0] && data[i][cols[j]] < ranges[cols[j]][1]
              ) {
                listGridColumn.classList.toggle('okay');
              } else if (!data[i][cols[j]]) {
                listGridColumn.classList.toggle('noresult');
                chartFlag = false;
              } else {
                listGridColumn.classList.toggle('fail');
              }
            }
            if (txtContent) {
              if (j >= 2) {
                const numb = parseFloat(txtContent).toFixed(2).toLocaleString('en-US');
                const displayedNumb = numb.endsWith('.00') ? numb.replace('.00', '') : numb;
                listGridColumn.textContent = `${displayedNumb}${metrics[j - 2]}`;
              } else {
                listGridColumn.textContent = txtContent;
              }
            } else if (j >= 3) {
              listGridColumn.textContent = 'n/a';
            }
          listGridRow.append(listGridColumn);
        }
        const params = new URLSearchParams(window.location.search);
        const nextUrl = data[i][cols[0]].replace('https://', '');
        params.set('url', nextUrl);

        listGridContainer.append(listGridRow);

        counter = i;
      }
      block.append(listGridContainer);

      if (data.length === 0) {
        const noresults = document.createElement('p');
        const params = new URLSearchParams(window.location.search);
        if (params.has('domainkey') && params.has('url')) {
          noresults.textContent = 'No results found.';
        } else {
          noresults.innerHTML = '<i>domainkey</i> and <i>url</i> (hostname) are required.  Please provide <a href="/">here</a>.';
        }
        block.append(noresults);
      }
    }
  };
  getQuery();
  makeList();
}
