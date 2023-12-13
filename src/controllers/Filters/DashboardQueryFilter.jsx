import {
  Flex, DateRangePicker, TextField, Form, ButtonGroup, Button, Divider, NumberField, Text,
  useDateFormatter,
} from '@adobe/react-spectrum';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import React, { useEffect } from 'react';
import { queryRequest } from '../../connectors/utils.js';
import './DashboardQueryFilter.css';
import FilterIcon from '@spectrum-icons/workflow/Filter';

export function DashboardQueryFilter({
  hasCheckpoint, dataEndpoint, apiEndpoint, data, setter, dataFlag, flagSetter,
}) {
  const [range, setRange] = React.useState({
    start: parseDate('2020-07-03'),
    end: parseDate('2020-07-10'),
  });
  const [filterData, setFilterData] = React.useState([]);
  useEffect(() => {
    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint)) {
      setter(window.dashboard[dataEndpoint].results.data); // Calling setter here to update
    }
  }, [data, filterData, dataFlag]);

  const formatter = useDateFormatter({ dateStyle: 'long' });
  const flag = 'rum-dashboardFlag';
  let execCount = 0;

  const getQuery = (cfg = {}) => {
    const {
      url, domainkey, startdate, enddate, hostname, limit,
    } = cfg;
    queryRequest(dataEndpoint, apiEndpoint, {
      domainkey, url, startdate, enddate, hostname, limit,
    });
  };

  const updateData = (cfg = {}) => {
    const { hostname, domainkey } = cfg;
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
      if (Object.hasOwn(window, flag) && window[flag] === true) {
        setter([]);
        flagSetter(window[flag]);
        execCount += 1;
      }
      window.setTimeout(() => { updateData(cfg); }, 1000);
    } else if (Object.hasOwn(window, flag) && window[flag] === false) {
      flagSetter(window[flag]);
      // query complete, hide loading graphic
      data = window.dashboard[dataEndpoint].results.data;
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
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const {
      start, end, ckpt, inputUrl, domainkey, limit,
    } = data;

    const currentpage = new URL(window.location.href);
    const params = currentpage.searchParams;
    const url = inputUrl || params.get('url');
    const hostname = url ? new URL(url.startsWith('https://') ? url : `https://${url}`).hostname : '';
    const key = domainkey || (params.get('domainkey') ? params.get('domainkey') : hostname ? localStorage.getItem(hostname) : '');

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

    getQuery(configuration);
    updateData(configuration);
  };

  return (
        <>
            <Flex direction="column" alignItems="center" height="100%" id='filter' rowGap={'size-250'}>
                <Text marginTop="size-250"><FilterIcon size='XL'></FilterIcon></Text>
                <Form onSubmit={onSubmit} method='get'>
                    <DateRangePicker
                        label="Date Range"
                        startName="start"
                        endName="end"
                        maxValue={today(getLocalTimeZone())}
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
                    <TextField name='inputUrl' label="Url" autoFocus isRequired></TextField>
                    <TextField name='domainkey' label='Domain Key' autoFocus></TextField>
                    {(hasCheckpoint
                        && <TextField name='ckpt' label="Checkpoint" autoFocus isRequired></TextField>
                    )}
                    <NumberField name='limit' label="Limit" defaultValue={30} minValue={10} />
                    <ButtonGroup>
                        <Button type="submit" variant="primary">Submit</Button>
                        <Button type="reset" variant="secondary">Reset</Button>
                    </ButtonGroup>
                </Form>
            </Flex>
        </>
  );
}
