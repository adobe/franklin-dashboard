import { Grid, View, Flex } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../core/Layout/Layout.jsx';
// import {DashboardQueryFilter} from 'controllers/Filters/DashboardQueryFilter.jsx';
import { DashboardQueryFilter } from '../../../controllers/Filters/DashboardQueryFilter.jsx';
import { DashboardChartView } from './DashboardChartView.jsx';

import './DashboardRUMPerformanceMonitor.css';

const DashboardRUMPerformanceMonitor = () => {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);

  useEffect(() => {
  }, [data, fetchFlag]);

  return (
    <DashboardLayout>
    <Grid areas={['heading heading',
      'sidebar charts',
      'sidebar charts']} columns={['.5fr', '6fr']} rows={['.5fr', '6fr']} height="87vh" width="100%" columnGap={'size-100'} id='table_gridview'>
            <View gridArea={'heading'}>
                <h1>Pageviews Chart</h1>
            </View>
            <View gridArea="sidebar" height="100%">
              <DashboardQueryFilter hasCheckpoint={false} hasDomainkeyField={true} hasUrlField={true} isReport={true}
              data={data} setter={setData} dataEndpoint={'rum-pageviews'}
              apiEndpoint={'https://helix-pages.anywhere.run/helix-services/run-query@v3'}
              dataFlag={fetchFlag} flagSetter={setFetchFlag}>
              </DashboardQueryFilter>
            </View>
            <View gridArea="charts" width="100%" height="100%" overflow="hidden">
              <Flex width="100%" height="100%">
                <DashboardChartView data={data} dataFlag={fetchFlag} dataEndpoint={'rum-pageviews'}></DashboardChartView>
              </Flex>
            </View>
        </Grid>
    </DashboardLayout>
  );
};

export default DashboardRUMPerformanceMonitor;
