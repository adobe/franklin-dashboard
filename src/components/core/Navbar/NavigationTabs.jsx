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

  const currentQueryParameters = new URLSearchParams(location.search);

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
                navigate(`/rum-dashboard?${currentQueryParameters.toString()}`);
              }
            }}
        >
            RUM Dashboard
        </Button>
          <Tooltip>Explore RUM Dashboard for {globalUrl}</Tooltip>
        </TooltipTrigger>

        </div>
    </Provider>

  );
};
export default NavigationTabs;
