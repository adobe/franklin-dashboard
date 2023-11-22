/**
 * bidirectional conversion startdate/enddate to offset/interval
 */
async function bidirectionalConversion() {
  let offset;
  let interval;

  const params = new URLSearchParams(window.location.search);
  // if (!endpoint) {
  //   throw new Error('No Endpoint Provided, No Data to be retrieved for Block');
  // }

  let hasStart = params.has('startdate');
  let hasEnd = params.has('enddate');
  let hasInterval = params.has('interval');
  let hasOffset = params.has('offset');

  const dateValid = hasStart && hasEnd && params.get('startdate').length > 4 && params.get('enddate').length > 4;
  const intervalValid = hasInterval && hasOffset && parseInt(params.get('interval'), 10) >= 0 && parseInt(params.get('offset'), 10) >= 0;

  let start = new Date(params.get('startdate'));
  let end = new Date(params.get('enddate'));
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
    const dateOffsetInMillis = (24 * 60 * 60 * 1000) * offset;
    const intervalInMillis = (24 * 60 * 60 * 1000) * interval;
    end = today - dateOffsetInMillis;
    start = end - intervalInMillis;
    /* eslint-disable prefer-destructuring */
    startdate = new Date(start).toISOString().split('T')[0];
    enddate = new Date(end).toISOString().split('T')[0];
    params.set('startdate', startdate);
    params.set('enddate', enddate);
  } else {
    offset = 0;
    interval = 30;
    const dateOffsetInMillis = (24 * 60 * 60 * 1000) * offset;
    const intervalInMillis = (24 * 60 * 60 * 1000) * interval;
    end = today - dateOffsetInMillis;
    start = end - intervalInMillis;
    startdate = new Date(start).toISOString().split('T')[0];
    enddate = new Date(end).toISOString().split('T')[0];
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
 * takes block and preemptively fires off requests for resources in worker thread
 * @param {*} main
 */
async function queryRequest(endpoint, endpointHost, qps = {}) {
  const pms = await bidirectionalConversion();

  // remove http or https prefix in url param if it exists
  if (pms.has('url')) {
    pms.set('url', pms.get('url').replace(/^http(s)*:\/\//, ''));
  }

  const limit = pms.get('limit') || '30';
  pms.set('limit', limit);
  Object.entries(qps).forEach(([k, v]) => {
    pms.set(k, v);
  });
  /*
    Below are specific parameters set for specific queries
    This is intended as short term solution; will discuss
    more with data desk engineers to determine a more clever
    way to specify different parameters; or escalate to repairing
    queries when needed
    */
  if (endpoint === 'github-commits' || endpoint === 'rum-pageviews' || endpoint === 'daily-rum') {
    const currLimit = parseInt(limit, 10);
    if (currLimit < 500) {
      pms.set('limit', '500');
    }
  }
  const flag = `${endpoint}Flag`;
  const checkData = () => {
    if (Object.hasOwn(window, flag) && window[flag] === true) {
      window.setTimeout(checkData, 5);
    } else if (!Object.hasOwn(window, flag)) {
      window[flag] = true;
      fetch(`${endpointHost}${endpoint}?${pms.toString()}`)
        .then((resp) => resp.json())
        .then((data) => {
          window[flag] = false;
          if (!Object.hasOwn(window, 'dashboard')) {
            window.dashboard = {};
          }
          window.dashboard[endpoint] = data;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('API Call Has Failed, Check that inputs are correct', err.message);
        });
    }
  };
  checkData();
}

export default queryRequest;