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

export function DashboardQueryFilter({
  hasCheckpoint, dataEndpoint, apiEndpoint, data, setter, dataFlag, flagSetter, config, configSetter
}) {
  const globalPage = new URL(window.location.href);
  const globalParams = globalPage.searchParams;
  const [range, setRange] = React.useState({
    start: globalParams.get('startdate') ? parseDate(globalParams.get('startdate')) : parseDate('2020-07-03'),
    end: globalParams.get('enddate') ? parseDate(globalParams.get('enddate')) : parseDate('2020-07-10'),
  });
  const [filterData, setFilterData] = React.useState([]);

  useEffect(() => {
    checkParams();
  }, [config])

  const checkParams = () => {
    const params = globalPage.searchParams;
    if(params.get('domainkey') && params.get('startdate') && params.get('enddate') && params.get('url') && params.get('limit')){
      const paramCfg = {
        url: params.get('url'),
        domainkey: params.get('domainkey'),
        startdate: params.get('stardate'),
        enddate: params.get('enddate'),
        apiEndpoint: 'https://helix-pages.anywhere.run/helix-services/run-query@ci6481/rum-dashboard',
        dataEndpoint: 'daily-rum',
        limit: params.get('limit')
      };
      getQuery(paramCfg);
      updateData(paramCfg);
    }
  }
  useEffect(() => {
    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint)) {
      setter(window.dashboard[dataEndpoint].results.data); // Calling setter here to update
    }
  }, [data, filterData, dataFlag]);

  const formatter = useDateFormatter({ dateStyle: 'long' });
  const flag = `${dataEndpoint}Flag`;
  let execCount = 0;

  const getQuery = (cfg = {}) => {
    const {
      url, domainkey, startdate, enddate, hostname, limit,
    } = cfg;
    const config = {
      domainkey, url, startdate, enddate, hostname, limit,
    }
    queryRequest(dataEndpoint, apiEndpoint, config);
  };

  const updateData = (cfg = {}) => {
    const { hostname, domainkey } = cfg;
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
      if (Object.hasOwn(window, flag) && window[flag] === true) {
        setter([]);
        flagSetter(window[flag]);
        // execCount += 1;
      }
      window.setTimeout(() => { updateData(cfg); }, 1000);
    } else if (Object.hasOwn(window, flag) && window[flag] === false) {
      flagSetter(window[flag]);
      // query complete, hide loading graphic
      // data = window.dashboard[dataEndpoint].results.data;
      setFilterData(window.dashboard[dataEndpoint].results.data);

      // If this domainkey works, store it in local storage
      if (window.dashboard[dataEndpoint].results.data.length > 0) {
        localStorage.setItem(hostname, domainkey);
      }
    }
  };

  const onSubmit = (e) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const {
      start, end, ckpt, inputUrl, domainkey, limit,
    } = formData;

    const currentpage = new URL(window.location.href);
    const params = currentpage.searchParams;
    const url = inputUrl || params.get('url');
    let hostname = '';
    if (url) {
      if (url.startsWith('https://')) {
        hostname = new URL(url).hostname;
      } else {
        hostname = new URL(`https://${url}`).hostname;
      }
    }

    let key = domainkey || params.get('domainkey') || '';
    if (!domainkey && !params.get('domainkey') && hostname) {
      key = localStorage.getItem(hostname) || '';
    }
    const configuration = {
      url: inputUrl,
      hostname,
      domainkey: key,
      startdate: start,
      enddate: end,
      apiEndpoint,
      dataEndpoint,
      limit,
    };

    // conditional params
    if (hasCheckpoint) {
      configuration.ckpt = ckpt;
    }

    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint)) {
      delete window.dashboard[dataEndpoint];
      delete window[flag];
    }

    setRange({ start: parseDate(start), end: parseDate(end) });

    if(configSetter){
      configSetter(configuration);
    }
    getQuery(configuration);
    updateData(configuration);
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
                        defaultValue={{start: globalParams.get('startdate') ? parseDate(globalParams.get('startdate')) : null, end: globalParams.get('enddate') ? parseDate(globalParams.get('enddate')) : null}}
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
                    <TextField name='inputUrl' label="Url" defaultValue={globalParams.get('url') ? globalParams.get('url') : '' } autoFocus isRequired></TextField>
                    <TextField name='domainkey' label='Domain Key' defaultValue={globalParams.get('domainkey') ? globalParams.get('domainkey') : '' } type='password' autoFocus></TextField>
                    {(hasCheckpoint
                        && <TextField name='ckpt' label="Checkpoint" autoFocus isRequired></TextField>
                    )}
                    <NumberField name='limit' label="Limit" defaultValue={globalParams.get('limit') ? globalParams.get('limit') : '30' } minValue={10} />
                    <ButtonGroup>
                        <Button type="submit" variant="primary">Submit</Button>
                        <Button type="reset" variant="secondary">Reset</Button>
                    </ButtonGroup>
                </Form>
            </Flex>
        </>
  );
};

export default DashboardQueryFilter;
