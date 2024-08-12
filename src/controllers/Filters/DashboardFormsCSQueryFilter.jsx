/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import { Flex, DatePicker, TextField, Form, Button, ComboBox, Item,Text } from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import React, { useEffect } from 'react';
import FilterIcon from '@spectrum-icons/workflow/Filter';
import SearchIcon from '@spectrum-icons/workflow/Search';
import './DashboardQueryFilter.css';
import { useStore, initStore } from '../../stores/global.js';
import {
  getEDSCSFormSubmission, intervalOffsetToDates, getDataDates, handleRedirect,
} from '../../connectors/utils.js';
import formsProgramMapping from './../../components/views/FormsCSDashboardRUMView/forms_program_id_name_mapping.json';

export function DashboardFormsCSQueryFilter({
  hasCheckpoint, hasUrlField, hasDomainkeyField, dataEndpoint,
  apiEndpoint, data, setter, dataFlag, flagSetter,
}) {
  const [filterData, setFilterData] = React.useState([]);
  const {
    setGlobalUrl, setHostName, globalUrl, domainKey, setDomainKey,
    setStartDate, setEndDate, startDate, endDate, setDataEndpoint, setTenantName,
  } = useStore();
  let navigate = null;
  const uniqueTenants = Array.from(new Set(formsProgramMapping.map(item => item.tenant)))
        .map(tenant => ({
            tenant,
            value: tenant
        }));

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }
  const dates = intervalOffsetToDates(0, 30);
  const [range, setRange] = React.useState(() => {
    const currDataDates = getDataDates();
    const currStart = currDataDates.start ? parseDate(currDataDates.start) : null;
    const currEnd = currDataDates.end ? parseDate(currDataDates.end) : null;
    const urlParameters = new URLSearchParams(window.location.search);
    const domainkeyParam = urlParameters.get('domainkey');
    const startdateParam = urlParameters.get('startdate');
    const enddateParam = urlParameters.get('enddate');
    const interval = urlParameters.get('interval');
    const offset = urlParameters.get('offset');
    const urlParam = urlParameters.get('url');
    let returnObj;

    if (domainkeyParam && ((startdateParam && enddateParam) || (interval && offset)) && urlParam) {
      let urlDates;
      if (interval && offset) {
        urlDates = intervalOffsetToDates(offset, interval);
      } else {
        urlDates = { start: startdateParam, end: enddateParam };
      }
      returnObj = {
        start: parseDate(urlDates.start),
        end: parseDate(urlDates.end),
      };
    } else {
      returnObj = {
        start: currStart || parseDate(dates.start),
        end: currEnd || parseDate(dates.end),
      };
    }
    setStartDate(returnObj.start);
    setEndDate(returnObj.end);
    return returnObj;
  });

  let timezone = new URLSearchParams(window.location.search).get('timezone');
  if (timezone === 'null' || timezone == null) timezone = '';
  if (timezone === '') timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (Object.hasOwn(window, 'dashboard') && Object.hasOwn(window.dashboard, dataEndpoint) && Object.hasOwn(window.dashboard[dataEndpoint], 'results')) {
      setter(window.dashboard[dataEndpoint].results.data); // Calling setter here to update
    }
  }, [data, filterData, dataFlag, globalUrl, startDate, endDate]);

  const getQuery = async (cfg = {}) => {
    const {
      url, domainkey, startdate, enddate, hostname, limit, checkpoint, dataEP, apiEP,
    } = cfg;

    const config = {
      domainkey, url, startdate, enddate, hostname, limit, checkpoint,
    };
    await getEDSCSFormSubmission(dataEP, apiEP, config, flagSetter);
  };

  const updateData = (cfg = {}) => {
    const {
      dataEP, url, domainkey, tenantUrl
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
      const currStart = currDates.start ? parseDate(currDates.start) : null;
      const currEnd = currDates.end ? parseDate(currDates.end) : null;
      if (currStart && currEnd) {
        setRange({ start: parseDate(getDataDates().start), end: parseDate(getDataDates().end) });
      }
      setDomainKey(domainkey);
      setGlobalUrl(url);
      setDataEndpoint(dataEndpoint);
      setStartDate(currStart);
      setEndDate(currEnd);
      setTenantName(tenantUrl);
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
    urlLimit = urlLimit || '2000';

    let configuration;
    let hostname;

    if (domainkeyParam && urlParam) {
      setDomainKey(domainkeyParam);
      setGlobalUrl(urlParam);
      let urlDates;
      if (interval && offset) {
        urlDates = intervalOffsetToDates(offset, interval);
      } else {
        urlDates = { start: startdateParam || dates.start, end: enddateParam || dates.end };
      }
      hostname = getHostname(urlParam);
      configuration = {
        url: urlParam,
        domainkey: domainkeyParam,
        startdate: urlDates.start,
        enddate: urlDates.end,
        hostname,
        apiEP: apiEndpoint,
        dataEP: dataEndpoint,
        limit: urlLimit,
        tenantUrl: "",
      };
      if (dataEndpoint === 'rum-sources') {
        configuration.checkpoint = '404';
      }

      if (
        domainkeyParam && ((startdateParam && enddateParam) || (interval && offset)) && urlParam
      ) {
        getQuery(configuration);
        updateData(configuration);
      } else {
        handleRedirect(
          configuration.url,
          configuration.domainkey,
          configuration.startdate,
          configuration.enddate,
          configuration.limit,
        );
      }
    } else {
      initStore();
      navigate('/');
    }
  }, []);

  const onSubmit = (e) => {
    const urlParameters = new URLSearchParams(window.location.search);
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const {
      start, end, tenantUrl, domainkey, limit,inputUrl,
    } = formData;

    const tenant = tenantUrl;
    const url = inputUrl;
    const startdate = start;
    const enddate = end;
    localStorage.setItem('tenantUrl', tenant);
    handleRedirect(url, domainkey, startdate, enddate, limit, timezone, urlParameters.get('ext'),tenant);
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
                  {hasUrlField && (
                    <ComboBox
                        name='tenantUrl'
                        label="Tenant"
                        autoFocus
                        placeholder="Select tenant"
                        isRequired
                        width="size-3000" // Set a specific width if needed
                    >
                        {uniqueTenants.length > 0 ? (
                            uniqueTenants.map((item, index) => (
                                <Item key={index} value={item.value}>
                                    {item.tenant}
                                </Item>
                            ))
                        ) : (
                            <Item value="">No tenants available</Item>
                        )}
                    </ComboBox>
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
                  {(
                    <TextField name='timezone' label="Timezone" autoFocus defaultValue={timezone} isDisabled isRequired={false}
                    />
                  )}
                  {(
                    <TextField name='timezone' defaultValue={timezone} isReadOnly isHidden
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

export default DashboardFormsCSQueryFilter;