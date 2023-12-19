import {
  Flex, DateRangePicker, TextField, Form, ButtonGroup, Button, NumberField, Text,
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
  const dates = intervalOffsetToDates(0, 30);
  const [range, setRange] = React.useState({
    start: parseDate(dates['start']),
    end: parseDate(dates['end']),
  });
  const [filterData, setFilterData] = React.useState([]);
  const { setReportUrl, globalUrl, domainKey } = useStore();
  useEffect(() => {
    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint)) {
      setter(window.dashboard[dataEndpoint].results.data); // Calling setter here to update
    }
  }, [data, filterData, dataFlag]);

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
    const { dataEP } = cfg;
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
    }
  };

  useEffect(() => {
    let url = localStorage.getItem('globalUrl');
    let hostname = '';
    if (url) {
      if (url.startsWith('https://')) {
        hostname = new URL(url).hostname;
      } else {
        hostname = new URL(`https://${url}`).hostname;
      }
    }

    const dates = intervalOffsetToDates(0, 30);
    const startdate = dates['start'];
    const enddate = dates['end'];

    const configuration = {
      url,
      domainkey: localStorage.getItem('domainKey'),
      startdate,
      enddate,
      hostname: hostname,
      apiEP: apiEndpoint,
      dataEP: dataEndpoint,
      limit: '30',
    };

    if(dataEndpoint === 'rum-pageviews'){
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

    let url = inputUrl;
    let hostname = '';
    if (url) {
      if (url.startsWith('https://')) {
        hostname = new URL(url).hostname;
      } else {
        hostname = new URL(`https://${url}`).hostname;
      }
    }

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

    setRange({ start: parseDate(start), end: parseDate(end) });

    if(configSetter){
      configSetter(configuration);
    }
    if(dataEndpoint === 'rum-sources'){
      configuration['checkpoint'] = '404';
    }
    getQuery(configuration);
    updateData(configuration);
    setReportUrl(inputUrl);
  };

  return (
        <>
            <Flex direction="column" alignItems="center" height="100%" id='filter' rowGap={'size-250'}> 
                <Text marginTop="size-250"><FilterIcon size='XL'></FilterIcon></Text>
                <Form onSubmit={onSubmit} method='get' isRequired>
                    <DateRangePicker
                        label="Date Range"
                        startName="start"
                        endName="end"
                        maxValue={today(getLocalTimeZone())}
                        defaultValue={range}
                        isRequired
                    />
                    <p>
                        Selected date: {range
                      ? formatter.formatRange(
                        range.start.toDate(getLocalTimeZone()),
                        range.end.toDate(getLocalTimeZone()),
                      )
                      : '--'}
                    </p>
                    {(
                      hasUrlField && <TextField name='inputUrl' label="Url" autoFocus defaultValue={globalUrl} isRequired></TextField>
                    )}
                    {(
                      hasDomainkeyField && <TextField name='domainkey' label='Domain Key' type='password' defaultValue={domainKey} autoFocus></TextField>
                    )}
                    {(
                      hasCheckpoint && <TextField name='ckpt' label="Checkpoint" autoFocus isRequired></TextField>
                    )}
                    <NumberField name='limit' label="Limit" minValue={10} />
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
