import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { drawLoading, hideLoading } from '../../scripts/loading.js';

export async function drawList(block, cfg) {
  // empty default content
  block.textContent = '';

  // prepare DOM for list
  const container = document.createElement('div');
  container.className = 'container-2col';
  block.appendChild(container);

  const headerTitle = document.createElement('div');
  headerTitle.classList.add('title', 'wide');
  headerTitle.textContent = cfg.title;
  container.appendChild(headerTitle);

  // draw the loading graphic
  const loading = document.createElement('div');
  loading.classList.add('loading', 'wide');
  container.appendChild(loading);
  drawLoading(loading);

  // prepare run-query params
  const currentpage = new URL(window.location.href);
  const params = currentpage.searchParams;
  const url = params.get('url');
  const domainkey = params.get('domainkey');
  // set defaults as needed
  let interval = params.get('interval') || '30';
  let offset = params.get('offset') || '0';
  const startdate = params.get('startdate') || '';
  const enddate = params.get('enddate') || '';
  const limit = params.get('limit') || '10';

  if (startdate !== '') {
    interval = '-1';
    offset = '-1';
  }

  // eslint-disable-next-line prefer-template
  const runquery = cfg.runquery
    + '?domainkey=' + domainkey
    + '&url=' + url
    + '&interval=' + interval
    + '&offset=' + offset
    + '&startdate=' + startdate
    + '&enddate=' + enddate;

  // call query
  const response = await fetch(runquery);
  const jsonData = await response.json();

  // query complete, hide loading graphic
  hideLoading(loading);

  // column headers
  const headerUrl = document.createElement('div');
  headerUrl.className = 'header';
  headerUrl.textContent = cfg.col1name;
  container.appendChild(headerUrl);

  const headerCount = document.createElement('div');
  headerCount.className = 'header';
  headerCount.textContent = cfg.col2name;
  container.appendChild(headerCount);

  // add results data
  let i = 0;
  while (i < jsonData.results.data.length && i < parseInt(limit, 10)) {
    // get data for specified columns
    const col1 = jsonData.results.data[i][cfg.col1value];
    const col2 = jsonData.results.data[i][cfg.col2value];

    // add rows, currently a two column grid
    const div1 = document.createElement('div');
    if ((i % 2) === 1) {
      div1.className = 'odd';
    }
    div1.textContent = col1;
    container.appendChild(div1);

    const div2 = document.createElement('div');
    if ((i % 2) === 1) {
      div2.className = 'odd';
    }
    div2.textContent = col2;
    container.appendChild(div2);

    i += 1;
  }
}

/**
 * loads and decorates the top pages block
 * @param {Element} block The top pages block element
 */
export default async function decorate(block) {
  // read block params
  const cfg = readBlockConfig(block);

  // draw list
  drawList(block, cfg);
}
