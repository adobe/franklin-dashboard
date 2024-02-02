import {
  Flex, DatePicker, TextField, Form, Button, Text
} from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import React, { useCallback, useEffect } from 'react';
// eslint-disable-next-line
import FilterIcon from '@spectrum-icons/workflow/Filter';
import SearchIcon from '@spectrum-icons/workflow/Search';
import './DashboardQueryFilter.css';
import { useStore, initStore } from 'stores/global.js';
import { queryRequest, intervalOffsetToDates, getDataDates, handleRedirect } from '../../connectors/utils.js';

export function DashboardQueryFilter({
  hasCheckpoint, hasUrlField, hasDomainkeyField, dataEndpoint, apiEndpoint, data, setter, dataFlag, flagSetter, configSetter,
}) {
  const [filterData, setFilterData] = React.useState([]);
  const {
    setGlobalUrl, setHostName, globalUrl, domainKey, setDomainKey, setStartDate, setEndDate, startDate, endDate, setDataEndpoint
  } = useStore();
  let navigate = null;
  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }
  const dates = intervalOffsetToDates(0, 30);
  const [range, setRange] = React.useState(() => {
    let currDataDates = getDataDates();
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
      const currDates = getDataDates();
      const currStart = currDates['start'] ? parseDate(currDates['start']) : null;
      const currEnd = currDates['end'] ? parseDate(currDates['end']) : null;
      if(currStart && currEnd){
        setRange({ start: parseDate(getDataDates()['start']), end: parseDate(getDataDates()['end']) });
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

    const dates = intervalOffsetToDates(0, 30);;
    let configuration;
    let hostname;

    if (domainkeyParam && urlParam) {
      setDomainKey(domainkeyParam);
      setGlobalUrl(urlParam);
      let urlDates;
      if(interval && offset){
        urlDates = intervalOffsetToDates(offset, interval);
      } else {
        urlDates = { start: startdateParam ? startdateParam : dates['start'], end: enddateParam ? enddateParam : dates['end'] };
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
      if (dataEndpoint === 'rum-sources') {
        configuration.checkpoint = '404';
      }
      
      if(domainkeyParam && ((startdateParam && enddateParam) || (interval && offset)) && urlParam){
        getQuery(configuration);
        updateData(configuration);
      }
      else{
        handleRedirect(configuration.url, configuration.domainkey, configuration.startdate, configuration.enddate, configuration.limit);
      }
    } else {
      initStore();
      navigate('/')
    }
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
    const startdate = start;
    const enddate = end;

    handleRedirect(url, domainkey, startdate, enddate, limit);
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
