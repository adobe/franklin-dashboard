import { Grid, View, Flex } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import './Home.css';
import { Filter } from 'components/Filters';
import { RumDashboard } from 'components/RumDashboard';

export function Home() {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);

  useEffect(() => {
    console.log('data has changed');
  }, [data, fetchFlag]);

  const columns = ['url', 'avgcls', 'avginp', 'avglcp', 'pageviews'];
  const columnHeadings = {
    pageviews: ['Pageviews', `Total visits to a url in date range chosen. Cut off is the end date of the range; i.e, 
    if you choose 1/1/2023 - 1/2/2023 you will only see results with dates that are less than 1/2/2023 not inclusive.`],
    rumshare: ['Percentage of Traffic', 'Percentage of the overall visits to a site, that went to this url, in chosen date range. '],
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
          'sidebar content1']} columns={['.5fr', '6fr']} rows={['auto']} height="100vh" width="100%" columnGap={'size-100'}>
            <View gridArea="sidebar" height="100%">
              <Filter hasCheckpoint={true}
              data={data} setter={setData} dataEndpoint={'rum-dashboard'}
              apiEndpoint={'https://helix-pages.anywhere.run/helix-services/run-query@ci6232'}
              dataFlag={fetchFlag} flagSetter={setFetchFlag}>
              </Filter>
            </View>

            <View gridArea="content1" width="100%" height="100%" overflow="hidden">
              <Flex width="100%" height="100%">
                <RumDashboard data={data} dataFlag={fetchFlag} width="100%" height="100%" columns={columns} columnHeadings={columnHeadings}></RumDashboard>
              </Flex>
            </View>
        </Grid>
  );
}
