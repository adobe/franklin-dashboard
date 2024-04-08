/* eslint-disable no-unused-vars */
import {
  Grid, View, Flex, Well, Text,
} from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-named-as-default
import DashboardQueryFilter from '../../../controllers/Filters/DashboardQueryFilter.jsx';
import { RumTableView } from './Dashboard404TableView.jsx';

// eslint-disable-next-line import/prefer-default-export
export function RumDashboardMain() {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
  }, [data, fetchFlag]);

  const columns = ['url', 'top_source', 'source_count', 'views'];
  const columnHeadings = {
    url: ['404 URL', 'A URL that is returning 404 Not Found status code indicates that the server is working; but unable to find the file being requested.'],
    top_source: ['Top Source', 'The most frequent referer for this URL.'],
    source_count: ['Source Count', 'The number of detected referers for this URL.'],
    views: ['Pageviews', 'Number of visitors who have been directed to a 404 from the URL.'],
  };

  return (
    <Grid areas={['heading heading',
      'sidebar content1',
      'sidebar content1']} columns={['.5fr', '6fr']} rows={['.5fr', '6fr']} height="87vh" width="100%" columnGap={'size-100'} id='table_gridview'>
            <View gridArea={'heading'}>
              <Well UNSAFE_style={{ textAlign: 'center' }}>
                <Text>
                  Use the reported URLs to repair any links for your site.
                </Text>
              </Well>
            </View>
            <View>
              <DashboardQueryFilter
                hasCheckpointField={false} hasUrlField={true} hasDomainkeyField={true}
                isReport={false} data={data} setter={setData} dataEndpoint={'rum-404'}
                apiEndpoint={'https://helix-pages.anywhere.run/helix-services/run-query@v3'}
                dataFlag={fetchFlag} flagSetter={setFetchFlag} config={config}
                configSetter={setConfig}>
              </DashboardQueryFilter>
            </View>

            <View gridArea="content1" width="100%" height="100%" overflow="hidden">
              <Flex width="100%" height="100%">
                <RumTableView
                data={data} setter={setData} dataFlag={fetchFlag} flagSetter={setFetchFlag} width="100%" height="100%" columns={columns}
                columnHeadings={columnHeadings} config={config} configSetter={setConfig}/>
              </Flex>
            </View>
        </Grid>
  );
}
