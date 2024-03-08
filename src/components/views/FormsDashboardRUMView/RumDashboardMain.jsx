import { Grid, View, Flex} from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import DashboardQueryFilter from '../../../controllers/Filters/DashboardQueryFilter';
import { RumTableView } from './RumTableView';


export function RumDashboardMain() {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    console.log("RumDashboardMain ---------");
  }, [data, fetchFlag]);

  const columns = ['url','views','submissions', 'avglcp', 'avgcls', 'avginp'];
  const columnHeadings = {
    views: ['Formviews', `Total form rendered to a url in date range chosen. Choosing date range 1/1/2023 - 1/2/2023
    will provide you data from 12AM 1/1/2023 through to end of day of 1/2/2023`],
    submissions: ['Formsubmission', `Total form submitted on a form in date range chosen. Choosing date range 1/1/2023 - 1/2/2023
    will provide you data from 12AM 1/1/2023 through to end of day of 1/2/2023`],
    avgcls: ['Cumulative Layout Shift', `CLS measures the sum total of all individual layout shift scores for every 
    unexpected layout shift that occurs during the entire lifespan of the page. The score is zero to any positive 
    number, where zero means no shifting and the larger the number, the more layout shift on the page. This is important
    because having pages elements shift while a user is trying to interact with it is a bad user experience. If you can't 
    seem to find the reason for a high value, try interacting with the page to see how that affects the score.`],

    avginp: ['Interaction to Next Paint', `A metric that assesses a page's overall responsiveness to user interactions by 
    observing the time that it takes for the page to respond to all click, tap, and keyboard interactions that occur throughout 
    the lifespan of a user's visit to a page. The final INP value is the longest interaction observed, ignoring outliers.`],

    avglcp: ['Largest Contentful Paint', `The amount of time to render the largest content element visible in the viewport, 
    from when the user requests the URL. The largest element is typically an image or video, or perhaps a large block-level text element.
    This metric is important because it indicates how quickly a visitor sees that the URL is actually loading.`],
  };

  return (
        <Grid areas={['sidebar content1',
          'sidebar content1']} columns={['.5fr', '6fr']} rows={['.5fr', '6fr']} height="87vh" width="100%" columnGap={'size-100'} id='table_gridview'>
            <View gridArea="sidebar" height="100%">
              <DashboardQueryFilter hasCheckpointField={false} hasUrlField={true} hasDomainkeyField={true} isReport={false}
              data={data} setter={setData} dataEndpoint={'rum-forms-dashboard'}
              apiEndpoint={'https://helix-pages.anywhere.run/helix-services/run-query@ci7006'}
              dataFlag={fetchFlag} flagSetter={setFetchFlag} config={config} configSetter={setConfig} formsURL={true}>
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
