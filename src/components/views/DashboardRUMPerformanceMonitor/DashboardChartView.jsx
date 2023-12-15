import { ProgressBar, Content, Heading, IllustratedMessage, View, Grid} from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import LineChart from '../../Charts/LineChart/LineChart';

export function DashboardChartView({
    data, dataFlag,
  }) {
    const ranges = {
        avglcp: [2.5, 4.0],
        avgfid: [100, 300],
        avginp: [200, 500],
        avgcls: [0.1, 0.25],
      };
    if (data.length > 0) {
        return (
            <Grid
            areas={[
              'chart1 chart2',
              'chart3 chart4',
            ]}
            columns={['.5fr', '6fr']} rows={['auto']} height="87vh" width="100%" columnGap={'size-100'} id="chartview"
            >
                <View gridArea="chart1" margin="auto">
                <LineChart data={data}
                title='(LCP) Largest Contentful Paint - 75p'
                x_datakey='date'
                y_datakey='avglcp'
                good_score={ranges['avglcp'][0]}
                bad_score={ranges['avglcp'][1]}
                syncId='date'/>
                </View>
                <View gridArea="chart2" margin="auto">
                    <LineChart data={data}
                    title='(FID) First Input Delay - 75p'
                    x_datakey='date'
                    y_datakey='avgfid'
                    good_score={ranges['avgfid'][0]}
                    bad_score={ranges['avgfid'][1]}
                    syncId='date'/>
                </View>
                <View gridArea="chart3" margin="auto">
                    <LineChart data={data} 
                    title='(INP) Interaction to Next Paint - 75p'
                    x_datakey='date'
                    y_datakey='avginp'
                    good_score={ranges['avginp'][0]}
                    bad_score={ranges['avginp'][1]}
                    syncId='date'/>
                </View>
                <View gridArea="chart4" margin="auto">
                <LineChart data={data} 
                title='(CLS) Cumulative Layout Shift - 75p'
                x_datakey='date'
                y_datakey='avgcls'
                good_score={ranges['avgcls'][0]}
                bad_score={ranges['avgcls'][1]}
                syncId='date'/>
                </View>
            </Grid>
        )
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