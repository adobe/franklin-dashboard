/* eslint-disable no-restricted-globals */
import { useCollator } from '@adobe/react-spectrum';
import sampleRUM from '../lib-franklin.js';
/**
 * Gets information on queries from rum-queries.json
 */
export function getQueryInfo() {
  window.gettingQueryInfo = true;
  fetch('/configs/rum-queries.json')
    .then((resp) => resp.json())
    .then((data) => {
      window.urlBase = {};
      window.urlBase = data.data;
      window.gettingQueryInfo = false;
    });
}

/**
   * configuration that selects correct base of url for a particular endpoint
   * @param {String} endpoint
   * @returns
   */
export function getUrlBase(endpoint) {
  const urlObj = window.urlBase.find((config) => config.endpoint === endpoint);
  return urlObj.base;
}

export function intervalOffsetToDates(offset, interval) {
  const dateOffsetInMillis = (24 * 60 * 60 * 1000) * offset;
  const intervalInMillis = (24 * 60 * 60 * 1000) * interval;
  const currentDate = new Date();
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0,
    0,
    0,
    0,
  );
  const end = today - dateOffsetInMillis;
  const start = end - intervalInMillis;
  /* eslint-disable prefer-destructuring */
  const startdate = new Date(start).toISOString().split('T')[0];
  const enddate = new Date(end).toISOString().split('T')[0];

  return { start: startdate, end: enddate };
}

export function getDataDates() {
  const pms = new URLSearchParams(location.search);
  const startdate = pms.get('startdate');
  const enddate = pms.get('enddate');
  return { start: startdate, end: enddate };
}

/**
 * bidirectional conversion startdate/enddate to offset/interval
 */
async function bidirectionalConversion(endpoint, qps = {}) {
  let offset;
  let interval;

  const params = new URLSearchParams(window.location.search);
  if (!endpoint) {
    throw new Error('No Endpoint Provided, No Data to be retrieved for Block');
  }

  Object.entries(qps).forEach(([k, v]) => {
    if (qps[k]) params.set(k, v);
  });
  let hasStart = params.has('startdate');
  let hasEnd = params.has('enddate');
  const hasInterval = params.has('interval');
  const hasOffset = params.has('offset');

  const dateValid = hasStart && hasEnd && params.get('startdate').length > 4 && params.get('enddate').length > 4;
  const intervalValid = hasInterval && hasOffset && parseInt(params.get('interval'), 10) >= 0 && parseInt(params.get('offset'), 10) >= 0;

  let startdate = params.get('startdate');
  let enddate = params.get('enddate');

  if (intervalValid) {
    offset = params.get('offset');
    interval = params.get('interval');
    const dates = intervalOffsetToDates(offset, interval);
    startdate = dates.start;
    enddate = dates.end;
    params.set('startdate', startdate);
    params.set('enddate', enddate);
  } else if (!intervalValid && !dateValid) {
    offset = 0;
    interval = 30;
    const dates = intervalOffsetToDates(offset, interval);
    startdate = dates.start;
    enddate = dates.end;
    params.set('startdate', startdate);
    params.set('enddate', enddate);
  }

  hasStart = params.has('startdate');
  hasEnd = params.has('enddate');

  if (!hasStart && !hasEnd) {
    offset = 0;
    interval = 30;
    const dates = intervalOffsetToDates(offset, interval);
    startdate = dates.start;
    enddate = dates.end;
    params.set('startdate', startdate);
    params.set('enddate', enddate);
  }
  params.set('interval', -1);
  params.set('offset', -1);

  // add timezone param if it is not present
  if (!params.has('timezone')) {
    params.set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  return params;
}

/**
 * a sort function for TableView React Component.
 */
export async function sort({ items, sortDescriptor }) {
  const collator = useCollator();

  return {
    items: items.sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      let cmp = collator.compare(first, second);
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1;
      }
      return cmp;
    }),
  };
}

/**
 * takes block and preemptively fires off requests for resources in worker thread
 * @param {*} main
 */
export async function queryRequest(endpoint, endpointHost, qps = {}) {
  const pms = await bidirectionalConversion(endpoint, qps);

  // remove http or https prefix in url param if it exists
  if (pms.has('url')) {
    pms.set('url', pms.get('url').replace(/^http(s)*:\/\//, ''));
  }

  const limit = (pms.get('limit') && (pms.get('limit') !== 'undefined') && (pms.get('limit') !== '')) ? pms.get('limit') : '150';
  pms.set('limit', limit);

  /*
    Below are specific parameters set for specific queries
    This is intended as short term solution; will discuss
    more with data desk engineers to determine a more clever
    way to specify different parameters; or escalate to repairing
    queries when needed
    */
  if (endpoint === 'github-commits' || endpoint === 'rum-pageviews' || endpoint === 'daily-rum') {
    pms.set('limit', '500');
  }
  const flag = `${endpoint}Flag`;
  const checkData = () => {
    if (Object.hasOwn(window, flag) && window[flag] === true) {
      window.setTimeout(checkData, 5);
    } else if (!Object.hasOwn(window, flag)) {
      window[flag] = true;
      fetch(`${endpointHost}/${endpoint}?${pms.toString()}`)
        .then((resp) => resp.json())
        .then((data) => {
          window[flag] = false;
          if (!Object.hasOwn(window, 'dashboard')) {
            window.dashboard = {};
          }
          window.dashboard[endpoint] = data;
          const rumData = { source: endpoint, target: pms.get('url') };
          sampleRUM('datadesk', rumData);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('API Call Has Failed, Check that inputs are correct', err.message);
        });
    }
  };
  checkData();
}

export function handleRedirect(url, domainkey, startdate, enddate, limit, timezone, ext) {
  let timezoneParam = timezone;
  const newQp = new URLSearchParams();
  newQp.set('url', url);
  newQp.set('domainkey', domainkey);
  newQp.set('startdate', startdate);
  newQp.set('enddate', enddate);
  if (timezone === 'null' || timezone === 'undefined' || timezone == null) timezoneParam = '';
  if(ext != null && ext != '')
    newQp.set('ext',ext);
  if (timezoneParam === '') timezoneParam = Intl.DateTimeFormat().resolvedOptions().timeZone;
  newQp.set('timezone', timezoneParam);
  if (limit) newQp.set('limit', limit);
  location.href = `${location.pathname}?${newQp.toString()}`;
}
