import { Grid, View } from '@adobe/react-spectrum';
import DashboardLayout from '../../core/Layout/Layout.jsx';
import LineChart from '../../charts/LineChart/LineChart.jsx';
import './DashboardRUMPerformanceMonitor.css';

const DashboardRUMPerformanceMonitor = () => {
  const domain = 'www.adobe.com';

  const dataChart1 = [
    {
      name: '2023-03-01',
      AVGLCP: 4505,
    },
    {
      name: '2023-03-02',
      AVGLCP: 3560,
    },
    {
      name: '2023-03-03',
      AVGLCP: 4532,
    },
  ];

  const dataChart2 = [
    {
      name: '2023-03-01',
      AVGFID: 7.022,
    },
    {
      name: '2023-03-02',
      AVGFID: 7.32,
    },
    {
      name: '2023-03-03',
      AVGFID: 8.55,
    },
  ];

  const dataChart3 = [
    {
      name: '2023-03-01',
      AVGINP: 80,
    },
    {
      name: '2023-03-02',
      AVGINP: 90,
    },
    {
      name: '2023-03-03',
      AVGINP: 100,
    },
  ];

  const dataChart4 = [
    {
      name: '2023-03-01',
      AVGCLS: 0.01,
    },
    {
      name: '2023-03-02',
      AVGCLS: 0.02,
    },
    {
      name: '2023-03-03',
      AVGCLS: 0.03,
    },
  ];

  return (
    <DashboardLayout>
        <Grid
            areas={[
              'chart1 chart2',
              'chart3 chart4',
            ]}
            columns={['2fr', '2fr']} rows={['auto']} height="87vh" width="100vw" columnGap='size-100' id="chartview"
            >
            <View gridArea="chart1" height="100%">
                <LineChart data={dataChart1}
                title='(LCP) Largest Contentful Paint - 75p'
                datakey='AVGLCP'
                domain={domain}
                syncId='name'

                />
            </View>
            <View gridArea="chart2" height="100%">
                <LineChart data={dataChart2}
                datakey='AVGFID'
                title='(FID) First Input Delay - 75p'
                domain={domain}
                syncId='name'

                />
            </View>
            <View gridArea="chart3" height="100%"
            >
                <LineChart data={dataChart3} title='(INP) Interaction to Next Paint - 75p'
                domain={domain}
                datakey='AVGINP'
                syncId='name'
 />
            </View>
            <View gridArea="chart4" height="100%"
            >
                <LineChart data={dataChart4} title='(CLS) Cumulative Layout Shift - 75p'
                domain={domain}
                datakey='AVGCLS'
                syncId='name'

 />
            </View>
        </Grid>
    </DashboardLayout>
  );
};

export default DashboardRUMPerformanceMonitor;
