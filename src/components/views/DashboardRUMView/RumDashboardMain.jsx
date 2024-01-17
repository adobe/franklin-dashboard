import { Grid, View, Flex, Badge, Text, Heading } from '@adobe/react-spectrum';
import { useState, useEffect } from 'react';
import DashboardQueryFilter from '../../../controllers/Filters/DashboardQueryFilter';
import { RumTableView } from './RumTableView';
import {Well} from '@adobe/react-spectrum'
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import Info from '@spectrum-icons/workflow/Info';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import SentimentNeutral from '@spectrum-icons/workflow/SentimentNeutral';
import AlertTriangle from '@spectrum-icons/workflow/Alert';


export function RumDashboardMain() {
  const [data, setData] = useState([]);
  const [fetchFlag, setFetchFlag] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
  }, [data, fetchFlag]);

  const columns = ['url', 'avglcp', 'avgcls', 'avginp', 'pageviews'];
  const columnHeadings = {
    pageviews: ['Pageviews', `Total visits to a url in date range chosen. Cut off is the end date of the range; i.e, 
    if you choose 1/1/2023 - 1/2/2023 you will only see results with dates that are less than 1/2/2023 not inclusive.`],
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
        <Grid areas={['heading heading',
          'sidebar content1',
          'sidebar content1']} columns={['.5fr', '6fr']} rows={['.5fr', '6fr']} height="87vh" width="100%" columnGap={'size-100'} id='table_gridview'>
            <View gridArea={'heading'}>
              <Well UNSAFE_style={{textAlign: 'center'}}>
                <Flex alignItems={'center'} gridArea={'heading'} width='100%' columnGap={'size-1600'}>
                    <Info size='XXL'></Info>
                    <Flex direction={'column'} alignItems={'center'}>
                      <Badge width="size-500" variant="positive">
                        <CheckmarkCircle aria-label="Pass" />
                      </Badge>
                      <Text>This page is performing very well in the selected date range.</Text>
                    </Flex>
                    <Flex direction={'column'} alignItems={'center'}>
                      <Badge width="size-500" variant="yellow">
                        <AlertTriangle aria-label="Okay" />
                      </Badge>
                      <Text>Based on the selected date range, this page may need some improvement. Please bring this up with developers.</Text>
                    </Flex>
                    <Flex direction={'column'} alignItems={'center'}>
                      <Badge width="size-500" variant="negative">
                        <CloseCircle aria-label="Pass" />
                      </Badge>
                      <Text>This page is severely underperforming in the selected date range and may require developers to diagnose and correct the issue.</Text>
                    </Flex>
                    <Flex direction={'column'} alignItems={'center'}>
                      <Badge width="size-1000" variant="neutral">
                        <SentimentNeutral aria-label="N/A" />
                        <Text>N/A</Text>
                      </Badge>
                      <Text>There is not enough data, please wait until there is more traffic to this page.</Text>
                    </Flex>
                  </Flex>
              </Well>
            </View>
            <View gridArea="sidebar" height="100%">
              <DashboardQueryFilter hasCheckpointField={false} hasUrlField={true} hasDomainkeyField={true} isReport={false}
              data={data} setter={setData} dataEndpoint={'rum-dashboard'}
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
