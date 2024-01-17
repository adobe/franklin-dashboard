import { Grid, View, Flex, Well } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import DashboardQueryFilter from '../../../controllers/Filters/DashboardQueryFilter';
import { RumTableView } from './Dashboard404TableView';

export function RumDashboardMain() {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
  }, [data, fetchFlag]);

  const columns = ['topurl', 'source', 'views'];
  const columnHeadings = {
    topurl: ['404 URL', 'A URL that is returning 404 Not Found status code indicates that the server is working; but unable to find the file being requested.'],
    source: ['Source', 'URL or Checkpoint that led visitor to visit unfound page.'],
    views: ['Pageviews', 'Number of visitors who have been directed to a 404 from the URL or Checkpoint in the Source Column..'],
  };

  return (
    <Grid areas={['heading heading',
    'sidebar content1',
    'sidebar content1']} columns={['.5fr', '6fr']} rows={['.5fr', '6fr']} height="87vh" width="100%" columnGap={'size-100'} id='table_gridview'>
            <View gridArea={'heading'}>
              <Well UNSAFE_style={{textAlign: 'center'}}>
                Having pages that return 404 status codes, means they cannot be found on your server. This means if another website has a link to your page, then that traffic gets directed to a broken link.
                Below we detect the broken links in the <b>404 URL</b> column and where the visit originated from in the <b>Source</b> column, followed by how many people visited via that particular route.
              </Well>
            </View>
            <View>
              <DashboardQueryFilter hasCheckpointField={false} hasUrlField={true} hasDomainkeyField={true} isReport={false}
              data={data} setter={setData} dataEndpoint={'rum-sources'}
              apiEndpoint={'https://helix-pages.anywhere.run/helix-services/run-query@v3'}
              dataFlag={fetchFlag} flagSetter={setFetchFlag} config={config} configSetter={setConfig}>
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
