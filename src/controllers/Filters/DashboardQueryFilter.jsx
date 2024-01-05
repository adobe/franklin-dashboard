import {
  Flex, DatePicker, TextField, Form, ButtonGroup, Button, NumberField, Text,
  useDateFormatter,
} from '@adobe/react-spectrum';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import React, { useEffect } from 'react';
// eslint-disable-next-line
import FilterIcon from '@spectrum-icons/workflow/Filter';
import { queryRequest } from '../../connectors/utils.js';
import './DashboardQueryFilter.css';
import { useStore, initStore } from 'stores/global.js';
import { useNavigate } from 'react-router-dom';
import { intervalOffsetToDates } from '../../connectors/utils.js';

export function DashboardQueryFilter({
  hasCheckpoint, hasUrlField, hasDomainkeyField, dataEndpoint, apiEndpoint, data, setter, dataFlag, flagSetter, configSetter
}) {
  const [filterData, setFilterData] = React.useState([]);
  const { setGlobalUrl, globalUrl, domainKey, setDomainKey, setStartDate, setEndDate, startDate, endDate } = useStore();
  const dates = intervalOffsetToDates(0, 30);
  const [range, setRange] = React.useState({
    start: parseDate(dates['start']),
    end: parseDate(dates['end']),
  });
  useEffect(() => {
    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint)) {
      setter(window.dashboard[dataEndpoint].results.data); // Calling setter here to update
    }
  }, [data, filterData, dataFlag, globalUrl, startDate, endDate]);

  const formatter = useDateFormatter({ dateStyle: 'long' });
  const navigate = useNavigate();

  const getQuery = (cfg = {}) => {
    const {
      url, domainkey, startdate, enddate, hostname, limit, checkpoint, dataEP, apiEP
    } = cfg;
    
    const config = {
      domainkey, url, startdate, enddate, hostname, limit, checkpoint
    }
    if(dataEP === 'rum-pageviews'){
      queryRequest('rum-dashboard/pageviews', apiEP, config);
    }
    queryRequest(dataEP, apiEP, config);
  };

  const updateData = (cfg = {}) => {
    const { dataEP, url, domainkey, startdate, enddate } = cfg;
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
      setRange({ start: parseDate(startdate), end: parseDate(enddate) });
      setDomainKey(domainkey);
      setGlobalUrl(url);
      setStartDate(parseDate(startdate));
      setEndDate(parseDate(enddate));
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
    return hostname;
  }

  useEffect(() => {
    //check query parameters if this is a shareLink
    const urlParameters = new URLSearchParams(window.location.search);
    const domainkeyParam = urlParameters.get('domainkey');
    const startdateParam = urlParameters.get('startdate');
    const enddateParam = urlParameters.get('enddate');
    const urlParam = urlParameters.get('url');
    let urlLimit = urlParameters.get('limit');
    urlLimit = urlLimit ? urlLimit : '30';

    const dates = intervalOffsetToDates(0, 30);
    const startdate = range.start.toString();
    const enddate = range.end.toString();
    let configuration;
    let hostname;

    if(domainkeyParam && startdateParam && enddateParam && urlParam){
      setDomainKey(domainkeyParam);
      setGlobalUrl(urlParam);
      hostname = getHostname(urlParam)
      configuration = {
        url: urlParam,
        domainkey: domainkeyParam,
        startdate: startdateParam,
        enddate: enddateParam,
        hostname: hostname,
        apiEP: apiEndpoint,
        dataEP: dataEndpoint,
        limit: urlLimit,
      };
    }else{
      const thisUrl = localStorage.getItem('globalUrl');
      hostname = getHostname(thisUrl);
      configuration = {
        url: localStorage.getItem('globalUrl'),
        domainkey: localStorage.getItem('domainKey'),
        startdate,
        enddate,
        hostname: hostname,
        apiEP: apiEndpoint,
        dataEP: dataEndpoint,
        limit: '30',
      };
    }

    if(dataEndpoint === 'dash/rum-sources-aggregated'){
      configuration['checkpoint'] = '404'
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

      if(dataEndpoint === 'rum-pageviews'){
        delete window['rum-dashboard/pageviewsFlag'];
      }
    }

    if(configSetter){
      configSetter(configuration);
    }
    if(dataEndpoint === 'dash/rum-sources-aggregated'){
      configuration['checkpoint'] = '404';
    }
    getQuery(configuration);
    updateData(configuration);
  };

  return globalUrl && (
        <>
            <Flex direction="column" alignItems="center" height="100%" id='filter' rowGap={'size-250'}> 
                <Text marginTop="size-250"><FilterIcon size='XL'></FilterIcon></Text>
                <Form onSubmit={onSubmit} method='get' isRequired>
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
                      hasUrlField && <TextField name='inputUrl' label="Url" autoFocus defaultValue={globalUrl} isRequired></TextField>
                    )}
                    {(
                      hasDomainkeyField && <TextField name='domainkey' label='Domain Key' type='password' defaultValue={domainKey} autoFocus></TextField>
                    )}
                    {(
                      hasCheckpoint && <TextField name='ckpt' label="Checkpoint" autoFocus isRequired></TextField>
                    )}
                    <NumberField name='limit' label="Limit" minValue={10} defaultValue={30}/>
                    <ButtonGroup>
                        <Button type="submit" variant="primary">Submit</Button>
                        <Button type="reset" variant="secondary" onClick={() => {
                          initStore();
                          navigate('/');
                        }}>
                          Sign Out
                        </Button>
                    </ButtonGroup>
                </Form>
            </Flex>
        </>
  );
};

export default DashboardQueryFilter;
