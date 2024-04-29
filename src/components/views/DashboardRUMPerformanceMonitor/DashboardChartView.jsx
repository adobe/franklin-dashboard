import {
  ProgressBar, Content, Heading, IllustratedMessage, View, Grid, Badge, useDateFormatter,
} from '@adobe/react-spectrum';
import { parseDate } from '@internationalized/date';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { DashboardLineChart } from 'components/charts/LineChart/LineChart';
import './DashboardChartView.css';
import { getDataDates } from 'connectors/utils';

export function DashboardChartView({
  data, dataFlag,
}) {
  const formatter = useDateFormatter({ dateStyle: 'short' });

  if (data.length > 0) {
    let totalPageViews = 0;
    data.forEach((pageview) => {
      totalPageViews += parseInt(pageview.pageviews, 10);
    });

    const { start, end } = getDataDates();
    const currStart = start ? parseDate(start) : null;
    const currEnd = end ? parseDate(end) : null;
    const urlParameters = new URLSearchParams(location.search);
    const url = urlParameters.get('url').replace('https://', '');

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
                      {<a href={`https://${url}`}>{url}</a>} registered <Badge margin="auto" width="fit-content" UNSAFE_style={{ fontSize: '15px' }} alignSelf='center' variant='info'>{parseInt(totalPageViews, 10).toLocaleString('en-US')}</Badge>{` page views between ${formatter.formatRange(
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
