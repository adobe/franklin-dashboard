import {
  Flex, DatePicker, TextField, Form, ButtonGroup, Button, NumberField, Text,
  useDateFormatter, DialogTrigger, Dialog, Content,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';

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
    const urlParam = urlParameters.get('url');
    let returnObj;

    if(domainkeyParam && startdateParam && enddateParam && urlParam){
      returnObj = {
        start: parseDate(startdateParam), 
        end: parseDate(enddateParam)
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

  const [changedForm, setChangedForm] = React.useState(false);
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
    setChangedForm(false);
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
    const urlParam = urlParameters.get('url');
    let urlLimit = urlParameters.get('limit');
    urlLimit = urlLimit || '100';

    const dates = intervalOffsetToDates(0, 30);
    const startdate = range.start.toString();
    const enddate = range.end.toString();
    let configuration;
    let hostname;

    if (domainkeyParam && startdateParam && enddateParam && urlParam) {
      setDomainKey(domainkeyParam);
      setGlobalUrl(urlParam);
      hostname = getHostname(urlParam);
      configuration = {
        url: urlParam,
        domainkey: domainkeyParam,
        startdate: startdateParam,
        enddate: enddateParam,
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

    const configuration = {
      url,
      hostname,
      domainkey,
      startdate,
      enddate,
      apiEP: apiEndpoint,
      dataEP: dataEndpoint,
      limit,
    };

    // conditional params
    if (hasCheckpoint) {
      configuration.ckpt = ckpt;
    }

    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint)) {
      const flag = `${dataEndpoint}Flag`;
      delete window.dashboard[dataEndpoint];
      delete window[flag];
    }

    if (configSetter) {
      configSetter(configuration);
    }
    if (dataEndpoint === 'rum-sources') {
      configuration.checkpoint = '404';
    }
    getQuery(configuration);
    updateData(configuration);
  };

  const setChanged = useCallback(() => {
    setChangedForm(true);
  }, []);

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
                    onChange={setChanged}
                  />
                  <DatePicker
                    label="End Date"
                    name="end"
                    defaultValue={range.end}
                    maxValue={today(getLocalTimeZone())}
                    isRequired
                    onChange={setChanged}
                    />
                    {(
                      hasUrlField && <TextField name='inputUrl' label="Url" autoFocus defaultValue={globalUrl} isRequired
                        onChange={setChanged}
                      />
                    )}
                    {(
                      hasDomainkeyField && <TextField
                        name='domainkey' label='Domain Key' type='password' defaultValue={domainKey} autoFocus
                          onChange={setChanged}
                        />
                    )}
                    {(
                      hasCheckpoint && <TextField name='ckpt' label="Checkpoint" autoFocus isRequired
                        onChange={setChanged}
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
