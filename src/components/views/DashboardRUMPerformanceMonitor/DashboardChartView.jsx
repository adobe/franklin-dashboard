import { useEffect, useState } from 'react';
import {
  ProgressBar, Content, Heading, IllustratedMessage, View, Grid, Badge,
} from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import { useStore } from '../../../stores/global';

import { DashboardLineChart } from '../../charts/LineChart/LineChart.jsx';
import './DashboardChartView.css';
// import Dashboard404Report from '../Dashboard404Report/Dashboard404Report';

export function DashboardChartView({
  data, dataFlag,
}) {
  const { reportUrl } = useStore();
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
                      {'Your website: '} {<a href={window.dashboard['rum-dashboard/pageviews'].results.data[0].hostname}>{window.dashboard['rum-dashboard/pageviews'].results.data[0].hostname}</a>} registered <Badge margin="auto" width="fit-content" UNSAFE_style={{ fontSize: '15px' }} alignSelf='center' variant='info'>{parseInt(window.dashboard['rum-dashboard/pageviews'].results.data[0].pageviews, 10).toLocaleString('en-US')}</Badge>{' visits in the selected date range'}
                    </h2>
                    <h2 style={{ textAlign: 'center' }}>Pageviews Chart</h2>
                    <h2 style={{ textAlign: 'center' }}>{reportUrl}</h2>
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
