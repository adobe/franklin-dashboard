import {
  ProgressBar, Content, Heading, IllustratedMessage, View, Grid, Badge, Divider, useDateFormatter,
} from '@adobe/react-spectrum';
import { getLocalTimeZone, parseDate } from '@internationalized/date';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { DashboardLineChart } from 'components/charts/LineChart/LineChart';
import { useStore } from 'stores/global';
import './DashboardChartView.css';
import { getDataDates } from 'connectors/utils';

export function DashboardChartView({
  data, dataFlag, dataEndpoint
}) {
  const { globalUrl, startDate, endDate, setStartDate, setEndDate, hostName } = useStore();
  const formatter = useDateFormatter({ dateStyle: 'long' });

  if (data.length > 0) {
    let totalPageViews = 0;
    data.forEach((pageview) => {
      totalPageViews += parseInt(pageview.pageviews, 10);
    })

    const {start, end} = getDataDates(dataEndpoint);
    const currStart = start ? parseDate(start) : null;
    const currEnd = end ? parseDate(end) : null;

    return start && end && (
            <Grid
            areas={[
              'title',
              'chart1',
            ]}
             height="100%" width="100%" columnGap={'size-100'} id="chartview"
             rows={['.1fr', '5fr']} columns={['auto']}
            >
                <View gridArea="title" width="100%">
                    <h2 style={{ textAlign: 'center' }}>
                      {<a href={'https://'+hostName}>{hostName}</a>} registered <Badge margin="auto" width="fit-content" UNSAFE_style={{ fontSize: '15px' }} alignSelf='center' variant='info'>{parseInt(totalPageViews, 10).toLocaleString('en-US')}</Badge>{` visits between ${formatter.formatRange(
                        currStart.toDate(),
                        currEnd.toDate(),
                      )}`}
                    </h2>
                </View>
                <View gridArea="chart1" height="100%" width="90%">
                <DashboardLineChart data={data}
                title='Pageviews'
                x_datakey='time'
                y_datakey='pageviews'/>
                </View>
            </Grid>
    );
  }
  if (dataFlag) {
    return (
            <ProgressBar margin="auto" label="Loading…" isIndeterminate />
    );
  }
  return (
        <IllustratedMessage margin="auto">
            <NotFound />
            <Heading>No results</Heading>
            <Content>Use Filters</Content>
        </IllustratedMessage>
  );
}
