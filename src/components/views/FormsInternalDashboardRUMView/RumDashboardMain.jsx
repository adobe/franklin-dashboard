import { Grid, View, Flex} from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import DashboardInternalQueryFilter from '../../../controllers/Filters/DashboardInternalQueryFilter';
import { RumTableView } from './RumTableView';


export function RumDashboardMain() {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    console.log("RumDashboardMain ---------");
  }, [data, fetchFlag]);

  const columns = ['url','views','submissions'];
  const columnHeadings = {
    views: ['Formviews', `Total form rendered to a url in date range chosen. Choosing date range 1/1/2023 - 1/2/2023
    will provide you data from 12AM 1/1/2023 through to end of day of 1/2/2023`],
    submissions: ['Formsubmission', `Total form submitted on a form in date range chosen. Choosing date range 1/1/2023 - 1/2/2023
    will provide you data from 12AM 1/1/2023 through to end of day of 1/2/2023`],
  };
  
  return (
        <Grid areas={['sidebar content1',
          'sidebar content1']} columns={['.5fr', '6fr']} rows={['.5fr', '6fr']} height="87vh" width="100%" columnGap={'size-100'} id='table_gridview'>
            <View gridArea="sidebar" height="100%">
              <DashboardInternalQueryFilter hasCheckpointField={false} hasUrlField={true} hasDomainkeyField={true} isReport={false}
              data={data} setter={setData} dataEndpoint={'rum-forms-dashboard'}
              apiEndpoint={'https://helix-pages.anywhere.run/helix-services/run-query@ci8170'}
              dataFlag={fetchFlag} flagSetter={setFetchFlag} config={config} configSetter={setConfig} formsURL={true}>
              </DashboardInternalQueryFilter>
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
