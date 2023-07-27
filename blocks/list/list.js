import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getQueryInfo, queryRequest, getUrlBase } from '../../scripts/scripts.js';

export default function decorate(block) {
  // const perfRanges = {};

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const endpoint = cfg.data;
  /*
  if (Object.hasOwn(cfg, 'good') && Object.hasOwn(cfg, 'okay') && Object.hasOwn(cfg, 'poor')) {
    perfRanges[tableColumn] = {
      good: cfg.good.replace(' ', '').split(',').map((el) => parseFloat(el)),
      okay: cfg.okay.replace(' ', '').split(',').map((el) => parseFloat(el)),
      poor: cfg.poor.replace(' ', '').split(',').map((el) => parseFloat(el)),
    };
  }
  */

  cfg.block = block;
  // cfg.perfRanges = perfRanges;
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
      queryRequest(cfg, getUrlBase(endpoint));
      const loaderSpan = document.createElement('div');
      loaderSpan.className = 'loader';
      block.append(loaderSpan);
    }
  };

  const makeList = () => {
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
      window.setTimeout(makeList, 1000);
    } else if (Object.hasOwn(window, flag) && window[flag] === false) {
      // query complete, hide loading graphic
      const { data } = window.dashboard[endpoint].results;
      /*
      document.querySelectorAll('div.loading').forEach((loading) => {
        loading.style.display = 'none';
      });
      */

      const listGridContainer = document.createElement('div');
      listGridContainer.classList.add('grid', 'list', 'container');

      const cols = ['url', 'pageviews', 'usrexp', 'avglcp', 'avgcls', 'avgfid', 'avginp'];
      const metrics = ['s', '', 'ms', 'ms'];
      const ranges = {
        avglcp: [2500, 4000],
        avgfid: [100, 300],
        avginp: [200, 500],
        avgcls: [0.1, 0.25],
      };

      const listGridHeadingRow = document.createElement('div');
      listGridHeadingRow.classList.add('grid', 'list', 'row', 'heading');
      for (let j = 0; j < 7; j += 1) {
        const listGridHeadings = document.createElement('div');
        if (cols[j] === 'usrexp') {
          listGridHeadings.textContent = 'Core Web Vitals across visits';
        } else if (cols[j] === 'url') {
          listGridHeadings.textContent = 'Path';
        } else if (cols[j] === 'pageviews') {
          listGridHeadings.textContent = 'Page Views';
        } else if (cols[j] === 'avglcp') {
          listGridHeadings.textContent = 'Avg LCP';
        } else if (cols[j] === 'avgcls') {
          listGridHeadings.textContent = 'Avg CLS';
        } else if (cols[j] === 'avgfid') {
          listGridHeadings.textContent = 'Avg FID';
        } else if (cols[j] === 'avginp') {
          listGridHeadings.textContent = 'Avg INP';
        } else {
          listGridHeadings.textContent = cols[j];
        }
        listGridHeadings.classList.add('grid', 'list', 'col', 'heading');
        listGridHeadingRow.appendChild(listGridHeadings);
      }
      listGridContainer.appendChild(listGridHeadingRow);

      for (let i = 0; i < data.length; i += 1) {
        const listGridRow = document.createElement('div');
        listGridRow.classList.add('grid', 'list', 'row');
        if ((i % 2) === 1) {
          listGridRow.classList.add('odd');
        }
        const {
          lcpgood, lcpbad, clsgood, clsbad, fidgood, fidbad, inpgood, inpbad,
        } = data[i];

        const lcpOkay = 100 - (lcpgood + lcpbad);
        const clsOkay = 100 - (clsgood + clsbad);
        const fidOkay = 100 - (fidgood + fidbad);
        const inpOkay = 100 - (inpgood + inpbad);
        const avgOkay = Math.round((lcpOkay + clsOkay + fidOkay + inpOkay) / 4);
        const avgGood = Math.round((lcpgood + clsgood + fidgood + inpgood) / 4);
        const avgBad = Math.round((lcpbad + clsbad + fidbad + inpbad) / 4);
        for (let j = 0; j < 7; j += 1) {
          const listGridColumn = document.createElement('div');
          listGridColumn.classList.add('grid', 'list', 'col', cols[j]);
          if (cols[j] === 'usrexp') {
            const badPerc = document.createElement('div');
            const goodPerc = document.createElement('div');
            const okayPerc = document.createElement('div');
            badPerc.classList.add('grid', 'list', 'col', cols[j], 'badbar');
            goodPerc.classList.add('grid', 'list', 'col', cols[j], 'goodbar');
            okayPerc.classList.add('grid', 'list', 'col', cols[j], 'okaybar');
            const badPercentage = `${avgBad}%`;
            const goodPercentage = `${avgGood}%`;
            const okayPercentage = `${avgOkay}%`;
            badPerc.textContent = badPercentage;
            goodPerc.textContent = goodPercentage;
            okayPerc.textContent = okayPercentage;
            badPerc.style.width = badPercentage;
            goodPerc.style.width = goodPercentage;
            okayPerc.style.width = okayPercentage;
            if (avgBad < 10) badPerc.style.color = 'red';
            if (avgGood < 10) goodPerc.style.color = 'green';
            if (avgOkay < 10) okayPerc.style.color = 'orange';
            listGridColumn.appendChild(goodPerc);
            listGridColumn.appendChild(okayPerc);
            listGridColumn.appendChild(badPerc);
          } else {
            let txtContent;
            if (cols[j] === 'avglcp') {
              txtContent = data[i][cols[j]] / 1000.00;
            } else if (cols[j] === 'url') {
              listGridColumn.innerHTML = `<a href='${data[i][cols[j]]}' target="_blank">${data[i][cols[j]].replace(/^https?:\/\/[^/]+/i, '')}</a>`;
            } else if (cols[j] === 'pageviews') {
              txtContent = parseInt(data[i][cols[j]], 10).toLocaleString('en-US');
            } else {
              txtContent = data[i][cols[j]];
            }
            if (j >= 3) {
              if (data[i][cols[j]] <= ranges[cols[j]][0]) {
                listGridColumn.classList.toggle('pass');
              } else if (
                data[i][cols[j]] > ranges[cols[j]][0] && data[i][cols[j]] < ranges[cols[j]][1]
              ) {
                listGridColumn.classList.toggle('okay');
              } else {
                listGridColumn.classList.toggle('fail');
              }
            }
            if (txtContent) {
              if (j >= 3) {
                listGridColumn.textContent = `${txtContent}${metrics[j - 3]}`;
              } else {
                listGridColumn.textContent = txtContent;
              }
            }
          }
          listGridRow.append(listGridColumn);
        }
        listGridContainer.append(listGridRow);
      }
      block.append(listGridContainer);
    }
  };
  getQuery();
  makeList();
}
