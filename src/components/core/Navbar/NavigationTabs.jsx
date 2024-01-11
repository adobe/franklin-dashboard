import {
  Provider,
  Button,
  defaultTheme,
  TooltipTrigger,
  Tooltip,
} from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../stores/global.js';

const NavigationTabs = () => {
  const { globalUrl } = useStore();

  const currentTab = window.location.pathname.split('/')[1];

  let navigate = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  return (
    <Provider colorScheme="light" theme={defaultTheme}>
        <div style={{
          padding: '.7em',
          minWidth: '500px',
        }}>

        <TooltipTrigger delay={0}>
        <Button variant={currentTab === 'rum-dashboard' ? 'cta' : 'primary'}
            onPress={() => {
              if (navigate) {
                navigate('/rum-dashboard');
              }
            }}
        >
            RUM Dashboard
        </Button>
          <Tooltip>Explore RUM Dashboard for {globalUrl}</Tooltip>
        </TooltipTrigger>
        &nbsp;&nbsp;

        <TooltipTrigger delay={0}>
        <Button variant={currentTab === '404-reports' ? 'cta' : 'primary'}
            onPress={() => {
              if (navigate) {
                navigate('/404-reports');
              }
            }}
        >
            404 Reports
        </Button>
          <Tooltip>Explore 404 reports for {globalUrl}</Tooltip>
        </TooltipTrigger>
        &nbsp;&nbsp;

        <TooltipTrigger delay={0}>
        <Button variant={currentTab === 'pageviews-report' ? 'cta' : 'primary'}
            onPress={() => {
              if (navigate) {
                navigate('/pageviews-report');
              }
            }}
        >
            Pageviews Chart
        </Button>
          <Tooltip>Explore Pageviews for {globalUrl}</Tooltip>
        </TooltipTrigger>

        </div>
    </Provider>

  );
};
export default NavigationTabs;
