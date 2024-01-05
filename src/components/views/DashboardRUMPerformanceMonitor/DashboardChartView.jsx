import { ProgressBar, Content, Heading, IllustratedMessage, View, Grid, Badge, Divider, useDateFormatter} from '@adobe/react-spectrum';
import { getLocalTimeZone } from '@internationalized/date';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { DashboardLineChart } from 'components/charts/LineChart/LineChart';
import { useStore } from 'stores/global';
import './DashboardChartView.css';

export function DashboardChartView({
  data, dataFlag,
}) {
  const { globalUrl, startDate, endDate } = useStore();
  const formatter = useDateFormatter({ dateStyle: 'long' });

  if (data.length > 0) {
    return (
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
                      {'Your website: '} {<a href={window.dashboard['dash/pageviews'].results.data[0].hostname}>{window.dashboard['dash/pageviews'].results.data[0].hostname}</a>} registered <Badge margin="auto" width="fit-content" UNSAFE_style={{ fontSize: '15px' }} alignSelf='center' variant='info'>{parseInt(window.dashboard['dash/pageviews'].results.data[0].pageviews, 10).toLocaleString('en-US')}</Badge>{' between ' + formatter.formatRange(
                        startDate.toDate(getLocalTimeZone()),
                        endDate.toDate(getLocalTimeZone()),
                      )}
                    </h2>
                    <Divider size='M'></Divider>
                    <h2 style={{textAlign: 'center'}}>Pageviews Chart</h2>
                    <h2 style={{textAlign: 'center'}}>{globalUrl}</h2>
                </View>
                <View gridArea="chart1" margin="auto" height="100%" width="90%">
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
