/* eslint-disable no-restricted-globals */
import { useCollator } from '@adobe/react-spectrum';
import sampleRUM from '../lib-franklin.js';
import formsProgramMapping from './../components/views/FormsCSDashboardRUMView/forms_program_id_name_mapping.json';

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
export async function queryRequest(endpoint, endpointHost, qps = {}, deleteUrl) {
  const pms = await bidirectionalConversion(endpoint, qps);

  // remove http or https prefix in url param if it exists
  if (pms.has('url')) {
    pms.set('url', pms.get('url').replace(/^http(s)*:\/\//, ''));
  }

  const limit = (pms.get('limit') && (pms.get('limit') !== 'undefined') && (pms.get('limit') !== '')) ? pms.get('limit') : '150';
  pms.set('limit', limit);
  const offset = (pms.get('offset') && (pms.get('offset') !== 'undefined') && (pms.get('offset') !== '')) ? pms.get('offset') : '-1';
  pms.set('offset', offset);
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
    pms.set('limit', '500');
  }
  const flag = `${endpoint}Flag`;
  const checkData = async () => {
    if(endpoint === 'rum-forms-dashboard' || endpoint === 'rum-checkpoint-urls'){
      if(deleteUrl){
      pms.delete('url');
      }
      await fetch(`${endpointHost}/${endpoint}?${pms.toString()}`)
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
   else if (Object.hasOwn(window, flag) && window[flag] === true) {
      console.log("----checkdata------");
      window.setTimeout(checkData, 5);
    } else if (!Object.hasOwn(window, flag)) {
      window[flag] = true;
      console.log("----checkdata------");
      await fetch(`${endpointHost}/${endpoint}?${pms.toString()}`)
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
  await checkData();
}

export function handleRedirect(url, domainkey, startdate, enddate, limit, timezone, ext,tenantUrl="") {
  let timezoneParam = timezone;
  const newQp = new URLSearchParams();
  newQp.set('url', url);
  newQp.set('domainkey', domainkey);
  newQp.set('startdate', startdate);
  newQp.set('enddate', enddate);
  if (timezone === 'null' || timezone === 'undefined' || timezone == null) timezoneParam = '';
  if (timezoneParam === '') timezoneParam = Intl.DateTimeFormat().resolvedOptions().timeZone;
  newQp.set('timezone', timezoneParam);
  if (ext !== null && ext !== '') newQp.set('ext', ext);
  if (limit) newQp.set('limit', limit);
  location.href = `${location.pathname}?${newQp.toString()}`;
}

export async function  getBaseDomains(endpoint, endpointHost, qps = {}, flagSetter){
  const domains = new Set();
  const duplicateDomain = new Set();
  let data;
  let totalFormViews = 0;
  let totalFormSubmissions = 0;
  let viewData = [];
  const qpsparameter = {'offset': -1, 'limit': 500};
  do {
      try {
          // Make the queryRequest
          await queryRequest(endpoint, endpointHost, qpsparameter , true);

          // Process the data
          data = window.dashboard[endpoint].results.data || [];
          console.log("---domain------");
          for (let i = 0; i < data.length; i += 1) {
              let domain = data[i]['url'].replace(/^http(s)*:\/\//, '').split('/')[0]
              if (!domain.endsWith('hlx.page') && !domain.endsWith('hlx.live') && !(domain.indexOf('localhost')>-1)
                  && !(domain.indexOf('dev')>-1) && !(domain.indexOf('stage')>-1) && !(domain.indexOf('stagging')>-1) && !(domain.indexOf('main-')>-1)
                  && !(domain.indexOf('staging')>-1) && !(domain.indexOf('about:srcdoc')>-1)) {
                  domains.add(domain);
                      totalFormViews = totalFormViews + Number(data[i]['views']);
                      totalFormSubmissions = totalFormSubmissions + Number(data[i]['submissions']);
                      let found = false;
                      for (let j = 0; j < viewData.length; j++) {
                          console.log(data[i]['url']);
                          if (viewData[j]['url'].includes(domain)) {
                              duplicateDomain.add(data[i]['url']);
                              viewData[j]['views'] += Number(data[i]['views']);
                              viewData[j]['submissions'] += Number(data[i]['submissions']);
                              found = true;
                              break;
                          }
                      }
                      if (!found && !duplicateDomain.has(data[i]['url'])) {
                          let newData = {
                              url: domain,
                              views: Number(data[i]['views']),
                              submissions: Number(data[i]['submissions'])
                          };
                          viewData.push(newData);
                      }
              }
          }
          console.log("---domain--done------");
          // Update qps for the next iteration
          qpsparameter.offset = qpsparameter.offset + qpsparameter.limit;
          qpsparameter.limit = qpsparameter.limit * 2;
      } catch (error) {
          // Handle errors if necessary
          console.error("Error fetching data:", error);
      }
  } while (data && data.length > 0);
  console.log("-------domains------");
  console.log(domains);
  viewData.push({
    url: 'ALL',
    views: totalFormViews,
    submissions: totalFormSubmissions
});
  window.dashboard[endpoint].results.data = viewData;
  window.dashboard["domains"] = domains;
  window.dashboard['internalDataLoaded'] = true;
  window.dashboard["totalFormViews"] = totalFormViews;
  window.dashboard["totalFormSubmissions"] = totalFormSubmissions;
  flagSetter(true);
}


export async function  getEDSCSFormSubmission(endpoint, endpointHost, qps = {}, flagSetter){
  const domains = new Set();
  let data;
  let viewData = [];
  let totalFormSubmissions = 0;
  const hostnameToProgramIdMap = new Map(
    formsProgramMapping.map(item => [item.domain, item.tenant])
);
  const qpsparameter = {'offset': -1, 'limit': 500 ,'checkpoint': 'formsubmit', 'source': '#guideContainerForm'};
  do {
      try {
          // Make the queryRequest
          await queryRequest(endpoint, endpointHost, qpsparameter , true);

          // Process the data
          data = window.dashboard[endpoint].results.data || [];
          console.log("---CS Form submission------");
          
          let groupedData = new Map();  // Map to store grouped data when tenantName is 'All'
          
          for (let i = 0; i < data.length; i += 1) {
              let domain = data[i]['url'].replace(/^http(s)*:\/\//, '').replace(/^www\./, '').split('/')[0];
              
              if (!(data[i]['url'].includes('localhost') || data[i]['url'].includes('dev') || data[i]['url'].includes('qa') 
                  || data[i]['url'].includes('uat') || data[i]['url'].includes('publish-') || data[i]['url'].includes('stage')
                  || data[i]['url'].includes('test'))) {
                  
                  let orgName = hostnameToProgramIdMap.get(domain);
                  let tenantName = localStorage.getItem('tenantName');
          
                  if (tenantName === 'All') {
                      if (groupedData.has(orgName)) {
                          // If orgName already exists, aggregate the data
                          let existingData = groupedData.get(orgName);
                          existingData.submissions += Number(data[i]['actions']);
                      } else {
                          // If orgName doesn't exist, create a new entry
                          groupedData.set(orgName, {
                              url: '',  // You can decide what to do with the URL in this case
                              submissions: Number(data[i]['actions']),
                              tenantname: domain,
                              orgName: orgName
                          });
                      }
                  } else if (orgName === tenantName) {
                      // If tenantName is not 'All', process as usual
                      let newData = {
                          url: data[i]['url'],
                          submissions: Number(data[i]['actions']),
                          tenantname: domain,
                          orgName: orgName
                      };
                      domains.add(domain);
                      viewData.push(newData);
                      totalFormSubmissions += Number(data[i]['actions']);
                  }
              }
          }
          
          // If tenantName is 'All', push the grouped data into viewData
          if (localStorage.getItem('tenantName') === 'All') {
              groupedData.forEach((value, key) => {
                  viewData.push(value);
                  totalFormSubmissions += value.submissions;
              });
          }
          
          console.log("---domain----");
          console.log(domains);
          console.log("---CS Form submission--done------");
          // Update qps for the next iteration
          qpsparameter.offset = qpsparameter.offset + qpsparameter.limit;
          qpsparameter.limit = qpsparameter.limit * 2;
          qpsparameter.source = "#guideContainerForm";
          qpsparameter.checkpoint = "formsubmit";
      } catch (error) {
          // Handle errors if necessary
          console.error("Error fetching data:", error);
      }
  } while (data && data.length > 0);
  viewData.push({
    url: 'All',
    submissions: totalFormSubmissions,
    tenantname: 'All',
    orgName : 'All'
});
  window.dashboard[endpoint].results.data = viewData;
  window.dashboard['internalCSRUMDataLoaded'] = true;
  window.dashboard["totalFormSubmissions"] = totalFormSubmissions;
  flagSetter(true);
}
