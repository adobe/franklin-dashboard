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
  let extension = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  const currentQueryParameters = new URLSearchParams(location.search);
  // add timezone param if it is not present
  if (!currentQueryParameters.has('timezone')) {
    currentQueryParameters.set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  if (!currentQueryParameters.has('ext')) {
    extension = currentQueryParameters.get('ext');
  }

  return (
    <Provider colorScheme="light" theme={defaultTheme}>
        <div style={{
          padding: '.7em',
          minWidth: '700px',
        }}>

        <TooltipTrigger delay={0}>
        <Button variant={currentTab === 'rum-dashboard' ? 'cta' : 'primary'}
            onPress={() => {
              if (navigate) {
                navigate(`/rum-dashboard?${currentQueryParameters.toString()}`);
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
                navigate(`/404-reports?${currentQueryParameters.toString()}`);
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
                navigate(`/pageviews-report?${currentQueryParameters.toString()}`);
              }
            }}
        >
            Pageviews Chart
        </Button>
          <Tooltip>Explore Pageviews for {globalUrl}</Tooltip>
        </TooltipTrigger>
        &nbsp;&nbsp;
  {extension === "forms" ? (
     <TooltipTrigger delay={0}>
       <Button 
        variant={currentTab === 'forms-rum-dashboard' ? 'cta' : 'primary'}
        onPress={() => {
        if (navigate) {
          navigate(`/forms-rum-dashboard?${currentQueryParameters.toString()}`);
         }
        }}
      >
      Forms RUM Dashboard
      </Button>
     <Tooltip>Explore Forms RUM Dashboard for {globalUrl}</Tooltip>
     </TooltipTrigger>
  ) : null}
        </div>
    </Provider>

  );
};
export default NavigationTabs;