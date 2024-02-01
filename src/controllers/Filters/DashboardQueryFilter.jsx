import {
  Flex, DatePicker, TextField, Form, Button, Text
} from '@adobe/react-spectrum';

import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import React, { useCallback, useEffect } from 'react';
// eslint-disable-next-line
import FilterIcon from '@spectrum-icons/workflow/Filter';
import ShareIcon from '@spectrum-icons/workflow/Share';
import SearchIcon from '@spectrum-icons/workflow/Search';
import LogOut from '@spectrum-icons/workflow/LogOut';
import './DashboardQueryFilter.css';
import { useStore, initStore } from 'stores/global.js';
import { useNavigate } from 'react-router-dom';
import { queryRequest, intervalOffsetToDates, getDataDates } from '../../connectors/utils.js';

export function DashboardQueryFilter({
  hasCheckpoint, hasUrlField, hasDomainkeyField, dataEndpoint, apiEndpoint, data, setter, dataFlag, flagSetter, configSetter,
}) {
  const [filterData, setFilterData] = React.useState([]);
  const {
    setGlobalUrl, setHostName, globalUrl, domainKey, setDomainKey, setStartDate, setEndDate, startDate, endDate, setDataEndpoint
  } = useStore();
  const dates = intervalOffsetToDates(0, 30);
  const [range, setRange] = React.useState(() => {
    let currDataDates = getDataDates(dataEndpoint);
    const currStart = currDataDates['start'] ? parseDate(currDataDates['start']) : null;
    const currEnd = currDataDates['end'] ? parseDate(currDataDates['end']) : null;
    const urlParameters = new URLSearchParams(window.location.search);
    const domainkeyParam = urlParameters.get('domainkey');
    const startdateParam = urlParameters.get('startdate');
    const enddateParam = urlParameters.get('enddate');
    const interval = urlParameters.get('interval');
    const offset = urlParameters.get('offset');
    const urlParam = urlParameters.get('url');
    let returnObj;

    if(domainkeyParam && ((startdateParam && enddateParam) || (interval && offset)) && urlParam){
      let urlDates;
      if(interval && offset){
        urlDates = intervalOffsetToDates(offset, interval);
      }else{
        urlDates = { start: startdateParam, end: enddateParam };
      }
      returnObj = {
        start: parseDate(urlDates['start']), 
        end: parseDate(urlDates['end'])
      }
    } else {
        returnObj = {
        start: currStart ? currStart : parseDate(dates.start),
        end: currEnd ? currEnd : parseDate(dates.end),
      }
    }
    setStartDate(returnObj.start);
    setEndDate(returnObj.end);
    return returnObj;
  });

  useEffect(() => {
    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint) && Object.hasOwn(window.dashboard[dataEndpoint], 'results')) {
      setter(window.dashboard[dataEndpoint].results.data); // Calling setter here to update
    }
  }, [data, filterData, dataFlag, globalUrl, startDate, endDate]);

  const getQuery = (cfg = {}) => {
    const {
      url, domainkey, startdate, enddate, hostname, limit, checkpoint, dataEP, apiEP,
    } = cfg;

    const config = {
      domainkey, url, startdate, enddate, hostname, limit, checkpoint,
    };
    queryRequest(dataEP, apiEP, config);
  };

  const updateData = (cfg = {}) => {
    const {
      dataEP, url, domainkey, startdate, enddate,
    } = cfg;
    const flag = `${dataEP}Flag`;
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
      if (Object.hasOwn(window, flag) && window[flag] === true) {
        setter([]);
        flagSetter(window[flag]);
      }
      window.setTimeout(() => { updateData(cfg); }, 1000);
    } else if (Object.hasOwn(window, flag) && window[flag] === false) {
      flagSetter(window[flag]);
      // query complete, hide loading graphic
      // data = window.dashboard[dataEndpoint].results.data;
      setFilterData(window.dashboard[dataEP].results.data);
      const currDates = getDataDates(dataEndpoint);
      const currStart = currDates['start'] ? parseDate(currDates['start']) : null;
      const currEnd = currDates['end'] ? parseDate(currDates['end']) : null;
      if(currStart && currEnd){
        setRange({ start: parseDate(getDataDates(dataEndpoint)['start']), end: parseDate(getDataDates(dataEndpoint)['end']) });
      }
      setDomainKey(domainkey);
      setGlobalUrl(url);
      setDataEndpoint(dataEndpoint);
      setStartDate(currStart);
      setEndDate(currEnd);
    }
  };

  const getHostname = (url) => {
    let hostname = '';
    if (url) {
      if (url.startsWith('https://')) {
        hostname = new URL(url).hostname;
      } else {
        hostname = new URL(`https://${url}`).hostname;
      }
    }
    setHostName(hostname);
    return hostname;
  };

  useEffect(() => {
    // check query parameters if this is a shareLink
    const urlParameters = new URLSearchParams(window.location.search);
    const domainkeyParam = urlParameters.get('domainkey');
    const startdateParam = urlParameters.get('startdate');
    const enddateParam = urlParameters.get('enddate');
    const interval = urlParameters.get('interval');
    const offset = urlParameters.get('offset');
    const urlParam = urlParameters.get('url');
    let urlLimit = urlParameters.get('limit');
    urlLimit = urlLimit ? urlLimit : '2000';

    const dates = intervalOffsetToDates(0, 30);
    const startdate = range.start.toString();
    const enddate = range.end.toString();
    let configuration;
    let hostname;

    if (domainkeyParam && ((startdateParam && enddateParam) || (interval && offset)) && urlParam) {
      setDomainKey(domainkeyParam);
      setGlobalUrl(urlParam);
      let urlDates;
      if(interval && offset){
        urlDates = intervalOffsetToDates(offset, interval);
      } else {
        urlDates = { start: startdateParam, end: enddateParam };
      }
      hostname = getHostname(urlParam);
      configuration = {
        url: urlParam,
        domainkey: domainkeyParam,
        startdate: urlDates['start'],
        enddate: urlDates['end'],
        hostname,
        apiEP: apiEndpoint,
        dataEP: dataEndpoint,
        limit: urlLimit,
      };
    } else {
      const thisUrl = localStorage.getItem('globalUrl');
      hostname = getHostname(thisUrl);
      configuration = {
        url: localStorage.getItem('globalUrl'),
        domainkey: localStorage.getItem('domainKey'),
        startdate,
        enddate,
        hostname,
        apiEP: apiEndpoint,
        dataEP: dataEndpoint,
        limit: '100',
      };
    }

    if (dataEndpoint === 'rum-sources') {
      configuration.checkpoint = '404';
    }

    getQuery(configuration);
    updateData(configuration);
  }, []);

  const onSubmit = (e) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const {
      start, end, inputUrl, domainkey, ckpt, limit,
    } = formData;

    const url = inputUrl;
    const hostname = getHostname(url);

    const startdate = start;
    const enddate = end;

    const qpList = ['domainkey', 'startdate', 'enddate', 'url'];
    const newQp = new URLSearchParams();
    newQp.set('url', url);
    newQp.set('domainkey', domainkey);
    newQp.set('startdate', startdate);
    newQp.set('enddate', enddate);
    if(ckpt) newQp.set('checkpoint', ckpt);
    if(limit) newQp.set('limit', limit);

    location.href = `${location.host}?${newQp.toString()}`;
  };

  return globalUrl && (
        <>
            <Flex direction="column" alignItems="center" height="100%" id='filter' rowGap={'size-250'}>
                <Text marginTop="size-250"><FilterIcon size='XL'></FilterIcon></Text>
                <Form onSubmit={onSubmit} method='get' UNSAFE_style={{ alignItems: 'center' }} isRequired>
                  <DatePicker
                    label="Start Date"
                    name="start"
                    defaultValue={range.start}
                    isRequired
                  />
                  <DatePicker
                    label="End Date"
                    name="end"
                    defaultValue={range.end}
                    maxValue={today(getLocalTimeZone())}
                    isRequired
                    />
                    {(
                      hasUrlField && <TextField name='inputUrl' label="Url" autoFocus defaultValue={globalUrl} isRequired
                      />
                    )}
                    {(
                      hasDomainkeyField && <TextField
                        name='domainkey' label='Domain Key' type='password' defaultValue={domainKey} autoFocus
                        />
                    )}
                    {(
                      hasCheckpoint && <TextField name='ckpt' label="Checkpoint" autoFocus isRequired
                      />
                    )}

                    <br />
                      <Button
                        type="submit" variant="cta"><SearchIcon/><Text>Search</Text>
                      </Button>
                </Form>
            </Flex>
        </>
  );
}

export default DashboardQueryFilter;
