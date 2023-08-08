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
        // override default run-query limit handling with arbitrarily high number
        queryRequest(cfg, getUrlBase(endpoint), { limit: '100000' });
      }, 3000);

      drawLoader(block);
    }
  };

  const makeList = () => {
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
      window.setTimeout(makeList, 5);
    } else if (Object.hasOwn(window, flag) && window[flag] === false) {
      // query complete, hide loading graphic
      const { data } = window.dashboard[endpoint].results;
      hideLoader(block);

      // using a table instead of divs to leverage jquery tablesorter
      const table = document.createElement('table');
      table.classList.add('tablesorter');

      // prepare header row
      const thead = document.createElement('thead');
      const header = document.createElement('tr');
      const header1 = document.createElement('th');
      header1.textContent = 'Domain';
      const header2 = document.createElement('th');
      header2.classList.add('right');
      header2.textContent = 'First Visit';
      const header3 = document.createElement('th');
      header3.classList.add('right');
      header3.textContent = 'Last Visit';
      const header4 = document.createElement('th');
      header4.classList.add('right');
      header4.textContent = 'Current Month Est. Visits';
      const header5 = document.createElement('th');
      header5.classList.add('right');
      header5.textContent = 'Total Est. Visits';
      header.appendChild(header1);
      header.appendChild(header2);
      header.appendChild(header3);
      header.appendChild(header4);
      header.appendChild(header5);
      thead.appendChild(header);
      table.appendChild(thead);

      // prepare body rows
      const tbody = document.createElement('tbody');
      for (let i = 0; i < data.length; i += 1) {
        const row = document.createElement('tr');
        const col1 = document.createElement('td');
        col1.textContent = data[i].hostname;
        const col2 = document.createElement('td');
        col2.classList.add('right');
        col2.textContent = data[i].first_visit;
        const col3 = document.createElement('td');
        col3.classList.add('right');
        col3.textContent = data[i].last_visit;
        const col4 = document.createElement('td');
        col4.classList.add('right');
        col4.textContent = parseInt(data[i].current_month_visits || 0, 10).toLocaleString('en-US');
        const col5 = document.createElement('td');
        col5.classList.add('right');
        col5.textContent = parseInt(data[i].total_visits, 10).toLocaleString('en-US');
        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        row.appendChild(col4);
        row.appendChild(col5);
        tbody.appendChild(row);
      }
      table.appendChild(tbody);

      // add table to block and add sort functionality
      block.appendChild(table);
      // eslint-disable-next-line no-undef
      $('table.tablesorter').tablesorter();

      if (data.length === 0) {
        const noresults = document.createElement('p');
        const params = new URLSearchParams(window.location.search);
        if (params.has('domainkey')) {
          noresults.textContent = 'No results found.';
        } else {
          noresults.innerHTML = '<i>domainkey</i> is required.  Please provide <a href="/all-domains/">here</a>.';
        }
        block.append(noresults);
      }
    }
  };
  getQuery();
  makeList();
}
