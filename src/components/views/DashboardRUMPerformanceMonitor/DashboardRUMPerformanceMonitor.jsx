import { Grid, View, Flex } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../core/Layout/Layout.jsx';
import { DashboardQueryFilter } from 'controllers/Filters/DashboardQueryFilter.jsx';
import "./DashboardRUMPerformanceMonitor.css"
import { DashboardChartView } from './DashboardChartView.jsx';

const DashboardRUMPerformanceMonitor = () => {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  
  useEffect(() => {
    console.log('Performance Monitor');
  }, [data, fetchFlag]);

  return (
    <DashboardLayout>
        <Grid
            areas={[
              'sidebar charts charts',
              'sidebar charts charts',
            ]}
            columns={['.5fr', '6fr']} rows={['auto']} height="87vh" width="100%" columnGap={'size-100'} id="chartview"
            >
            <View gridArea="sidebar" height="100%">
              <DashboardQueryFilter hasCheckpoint={false}
              data={data} setter={setData} dataEndpoint={'daily-rum'}
              apiEndpoint={'https://helix-pages.anywhere.run/helix-services/run-query@ci6488/rum-dashboard'}
              dataFlag={fetchFlag} flagSetter={setFetchFlag}>
              </DashboardQueryFilter>
            </View>
            <View gridArea="charts" width="100%" height="100%" overflow="hidden">
              <Flex width="100%" height="100%">
                <DashboardChartView data={data} dataFlag={fetchFlag}></DashboardChartView>
              </Flex>
            </View>
        </Grid>
    </DashboardLayout>
  );
};

export default DashboardRUMPerformanceMonitor;
