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

export function getDataDates(endpoint) {
  if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, endpoint) && Object.hasOwn(window.dashboard[endpoint], 'meta')) {
    const reqParams = window.dashboard[endpoint].meta.data;
    let offset; let
      interval;
    reqParams.forEach((params) => {
      const { name, value } = params;
      if (name === 'offset') offset = value;
      if (name === 'interval') interval = value;
    });

    offset -= 1;
    return intervalOffsetToDates(offset, interval);
  }
  return {};
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
    if (params.get(k)) params.set(k, v);
  });
  let hasStart = params.has('startdate');
  let hasEnd = params.has('enddate');
  let hasInterval = params.has('interval');
  let hasOffset = params.has('offset');

  const dateValid = hasStart && hasEnd && params.get('startdate').length > 4 && params.get('enddate').length > 4;
  const intervalValid = hasInterval && hasOffset && parseInt(params.get('interval'), 10) >= 0 && parseInt(params.get('offset'), 10) >= 0;

  const start = new Date(params.get('startdate'));
  const end = new Date(params.get('enddate'));
  let startdate = params.get('startdate');
  let enddate = params.get('enddate');
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

  if (dateValid) {
    if (start < end && end <= today) {
      const offs = today - end;
      const intv = Math.abs(end - start);
      offset = offs >= 0 ? Math.ceil(offs / (1000 * 60 * 60 * 24)) : 0;
      interval = Math.ceil(intv / (1000 * 60 * 60 * 24));
    } else if (start === end) {
      offset = 0;
      interval = 0;
    } else {
      offset = -1;
      interval = -1;
    }
    params.set('offset', offset);
    params.set('interval', interval);
  } else if (intervalValid) {
    offset = params.get('offset');
    interval = params.get('interval');
    const dates = intervalOffsetToDates(offset, interval);
    startdate = dates.start;
    enddate = dates.end;
    params.set('startdate', startdate);
    params.set('enddate', enddate);
  } else {
    offset = 0;
    interval = 30;
    const dates = intervalOffsetToDates(offset, interval);
    startdate = dates.start;
    enddate = dates.end;
    params.set('startdate', startdate);
    params.set('enddate', enddate);
    params.set('offset', offset);
    params.set('interval', interval);
  }

  hasStart = params.has('startdate');
  hasEnd = params.has('enddate');
  hasInterval = params.has('interval');
  hasOffset = params.has('offset');

  // default to interval 30 if params are not set
  if (!hasStart && !hasEnd && !hasInterval && !hasOffset) {
    params.set('interval', '30');
    params.set('offset', '0');
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

  const limit = (pms.get('limit') !== 'undefined') && (pms.get('limit') !== '') ? pms.get('limit') : '150';
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
