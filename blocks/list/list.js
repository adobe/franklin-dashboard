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
      const currentpage = new URL(window.location.href);
      const params = currentpage.searchParams;
      const currURL = params.get('url') || null;
      const hostname = currURL ? new URL(currURL.startsWith('https://') ? currURL : "https://"+currURL).hostname : ''
      const domainkey = params.get('domainkey') || hostname ? localStorage.getItem(hostname) : '';

      hideLoader(block);

      //set heading rows.
      const table = document.createElement('table');
      const tableHead = document.createElement('thead');
      const trHead = document.createElement('tr');
      const tableBody = document.createElement('tbody');
      
      table.className = "spectrum-Table";
      tableHead.className = "spectrum-Table-head";
      tableBody.className = "spectrum-Table-body";

      const cols = ['url', 'pageviews', 'avglcp', 'avgcls', 'avginp', 'chart'];
      const metrics = ['s', '', 'ms', 'ms'];
      const ranges = {
        avglcp: [2500, 4000],
        avgfid: [100, 300],
        avginp: [200, 500],
        avgcls: [0.1, 0.25],
      };
      
      for (let j = 0; j < 6; j += 1) {
        const th = document.createElement('th');
        const titleSpan = document.createElement('span');
        if (cols[j] === 'url') {
          titleSpan.textContent = 'Path';
        } else if (cols[j] === 'pageviews') {
          titleSpan.textContent = 'Visits';
        } else if (cols[j] === 'avglcp') {
          titleSpan.textContent = 'LCP';
        } else if (cols[j] === 'avgcls') {
          titleSpan.textContent = 'CLS';
        } else if (cols[j] === 'avginp') {
          titleSpan.textContent = 'INP';
        } else if (cols[j] === 'chart'){
          titleSpan.textContent = "CWV Chart"
        } else {
          titleSpan.textContent = cols[j];
        }
        th.className = "spectrum-Table-headCell";
        th.ariaSort = "none";
        th.tabIndex = "0";
        titleSpan.className = "spectrum-Table-columnTitle";
        th.style.textAlign = 'center';
        th.append(titleSpan);
        trHead.append(th);
      }
      tableHead.append(trHead);
      table.append(tableHead);

      for (let i = 0; i < data.length; i += 1) {
        const dataRow = document.createElement('tr');
        dataRow.className = "spectrum-Table-row"
        const {
          lcpgood, lcpbad, clsgood, clsbad, fidgood, fidbad, inpgood, inpbad,
        } = data[i];

        const lcpOkay = 100 - (lcpgood + lcpbad);
        const clsOkay = 100 - (clsgood + clsbad);
        // const fidOkay = 100 - (fidgood + fidbad);
        const inpOkay = 100 - (inpgood + inpbad);
        let noresult;
        if ((lcpgood + lcpbad + clsgood + clsbad + inpgood + inpbad) === 0) {
          noresult = true;
        }
        const avgOkay = Math.round((lcpOkay + clsOkay + inpOkay) / 3);
        const avgGood = Math.round((lcpgood + clsgood + inpgood) / 3);
        const avgBad = Math.round((lcpbad + clsbad + inpbad) / 3);
        let chartFlag = true;
        for (let j = 0; j < 5; j += 1) {
          const listGridColumn = document.createElement('div');
          const dataItem = document.createElement('td');
          dataItem.className = "spectrum-Table-cell spectrum-Table-cell--divider";
            let innerDiv = document.createElement('div');
            let txtContent;
            innerDiv.className = "spectrum-Badge-label";
            if (cols[j] === 'avglcp') {
              txtContent = data[i][cols[j]] / 1000.00;
            } else if (cols[j] === 'url') {
              listGridColumn.innerHTML = `<a href='${data[i][cols[j]]}' target="_blank">${data[i][cols[j]].replace(/^https?:\/\/[^/]+/i, '').substring(0, 20)}${data[i][cols[j]].replace(/^https?:\/\/[^/]+/i, '').length > 20 ? '...' : ''}</a>`;
            } else if (cols[j] === 'pageviews') {
              const params = new URLSearchParams(window.location.search);
              const nextUrl = data[i][cols[0]].replace('https://', '');
              params.set('url', nextUrl);
              listGridColumn.innerHTML = `<a href="/views/rum-pageviews?${params.toString()}&domainkey=${domainkey}">${parseInt(data[i][cols[j]], 10).toLocaleString('en-US')}</a>`;
            } else {
              txtContent = data[i][cols[j]];
            }
            if (j >= 2 && j < 5) {
              if (data[i][cols[j]] && data[i][cols[j]] <= ranges[cols[j]][0]) {
                listGridColumn.className = "spectrum-Badge spectrum-Badge--sizeM spectrum-Badge--positive";
              } else if (
                data[i][cols[j]] > ranges[cols[j]][0] && data[i][cols[j]] < ranges[cols[j]][1]
              ) {
                listGridColumn.className = "spectrum-Badge spectrum-Badge--sizeM spectrum-Badge--notice";
              } else if (!data[i][cols[j]]) {
                listGridColumn.className = "spectrum-Badge spectrum-Badge--sizeM spectrum-Badge--neutral";
                chartFlag = false;
              } else {
                listGridColumn.className = "spectrum-Badge spectrum-Badge--sizeM spectrum-Badge--negative"
              }
              
            }
            if (txtContent) {
              if (j >= 2) {
                const numb = parseFloat(txtContent).toFixed(2).toLocaleString('en-US');
                const displayedNumb = numb.endsWith('.00') ? numb.replace('.00', '') : numb;
                innerDiv.textContent = `${displayedNumb}${metrics[j - 2]}`;
              } else {
                innerDiv.textContent = txtContent;
              }
            } else if (j >= 2) {
              innerDiv.textContent = 'n/a';
            }
            listGridColumn.appendChild(innerDiv);
            dataItem.append(listGridColumn);
          dataRow.append(dataItem);
        }
        const chartLink = document.createElement('div');
        const nextUrl = data[i][cols[0]].replace('https://', '');
        params.set('url', nextUrl);

        if (chartFlag) {
          chartLink.innerHTML = `<div><a target="_blank" href="/views/rum-performance-monitor?${params.toString()}&domainkey=${domainkey}">Perf Chart</a></div>`;
        } else {
          chartLink.innerText = 'No Data';
        }
        chartLink.classList.add('grid', 'list', 'col', 'clickChart');
        const chartdt = document.createElement('td');
        chartdt.classList.add("spectrum-Table-cell", "spectrum-Table-cell--divider");
        chartdt.append(chartLink);
        dataRow.append(chartdt);
        tableBody.append(dataRow);
        table.append(tableBody);

      }
      //block.append(table);
      block.parentElement.outerHTML = `<!-- WAI-ARIA 1.1: Accordion container role changed from "tablist" to "region" -->
      <div class="spectrum-Accordion spectrum-Accordion--spacious spectrum-Accordion--sizeS" role="region">
        <div class="spectrum-Accordion-item is-open" role="presentation">
      
          <!-- WAI-ARIA 1.1: Item header is a <button> wrapped within a <h3> element, rather than a <div> element with role="tab" -->
          <h3 class="spectrum-Accordion-itemHeading">
            <!-- WAI-ARIA 1.1: Item header <button> uses aria-expanded attribute to indicate expanded state. -->
            <button class="spectrum-Accordion-itemHeader" type="button" id="spectrum-accordion-item-0-header" aria-controls="spectrum-accordion-item-0-content" aria-expanded="true">Recent</button>
            <span class="spectrum-Accordion-itemIconContainer">
              <svg class="spectrum-Icon spectrum-UIIcon-ChevronRight75 spectrum-Accordion-itemIndicator" focusable="false" aria-hidden="true">
                <use xlink:href="#spectrum-css-icon-Chevron75" />
              </svg>
            </span>
          </h3>
      
          <!-- WAI-ARIA 1.1: Item content role changed from "tabpanel" to "region" -->
          <div class="spectrum-Accordion-itemContent" role="region" id="spectrum-accordion-item-0-content" aria-labelledby="spectrum-accordion-item-0-header">Item 1</div>
        </div>
        <div class="spectrum-Accordion-item is-disabled" role="presentation">
          <h3 class="spectrum-Accordion-itemHeading">
            <button class="spectrum-Accordion-itemHeader" type="button" disabled id="spectrum-accordion-item-1-header" aria-controls="spectrum-accordion-item-1-content" aria-expanded="false">Architecture</button>
            <span class="spectrum-Accordion-itemIconContainer">
              <svg class="spectrum-Icon spectrum-UIIcon-ChevronRight75 spectrum-Accordion-itemIndicator" focusable="false" aria-hidden="true">
                <use xlink:href="#spectrum-css-icon-Chevron75" />
              </svg>
            </span>
          </h3>
          <div class="spectrum-Accordion-itemContent" role="region" id="spectrum-accordion-item-1-content" aria-labelledby="spectrum-accordion-item-1-header">Item 2</div>
        </div>
        <div class="spectrum-Accordion-item" role="presentation">
          <h3 class="spectrum-Accordion-itemHeading">
            <button class="spectrum-Accordion-itemHeader" type="button" id="spectrum-accordion-item-2-header" aria-controls="spectrum-accordion-item-2-content" aria-expanded="false">Nature</button>
            <span class="spectrum-Accordion-itemIconContainer">
              <svg class="spectrum-Icon spectrum-UIIcon-ChevronRight75 spectrum-Accordion-itemIndicator" focusable="false" aria-hidden="true">
                <use xlink:href="#spectrum-css-icon-Chevron75" />
              </svg>
            </span>
          </h3>
          <div class="spectrum-Accordion-itemContent" role="region" id="spectrum-accordion-item-2-content" aria-labelledby="spectrum-accordion-item-2-header">Item 3</div>
        </div>
        <div class="spectrum-Accordion-item" role="presentation">
          <h3 class="spectrum-Accordion-itemHeading">
            <button class="spectrum-Accordion-itemHeader" type="button" id="spectrum-accordion-item-3-header" aria-controls="spectrum-accordion-item-3-content" aria-expanded="false">Really Long Accordion Item According to Our Predictions</button>
            <span class="spectrum-Accordion-itemIconContainer">
              <svg class="spectrum-Icon spectrum-UIIcon-ChevronRight75 spectrum-Accordion-itemIndicator" focusable="false" aria-hidden="true">
                <use xlink:href="#spectrum-css-icon-Chevron75" />
              </svg>
            </span>
          </h3>
          <div class="spectrum-Accordion-itemContent" role="region" id="spectrum-accordion-item-3-content" aria-labelledby="spectrum-accordion-item-3-header">Item 4</div>
        </div>
      </div>`

      if (data.length === 0) {
        const noresults = document.createElement('p');
        const params = new URLSearchParams(window.location.search);
        if (params.has('domainkey') && params.has('url')) {
          noresults.innerHTML = 'No results found.';
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
