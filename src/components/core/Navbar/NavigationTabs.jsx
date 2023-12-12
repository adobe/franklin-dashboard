import React from 'react';
import {
  Provider,
  Button,
  defaultTheme,
} from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';

const NavigationTabs = () => {
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
        }}>
        <Button variant={currentTab === '404-reports' ? 'cta' : 'primary'}
            onPress={() => {
              if (navigate) {
                navigate('/404-reports');
              }
            }}
        >
            404 Reports
        </Button>
        &nbsp;&nbsp;
        <Button variant={currentTab === 'rum-dashboard' ? 'cta' : 'primary'}
            onPress={() => {
              if (navigate) {
                navigate('/rum-dashboard');
              }
            }}
        >
            RUM Dashboard
        </Button>
        &nbsp;&nbsp;
        <Button variant={currentTab === 'rum-monitor' ? 'cta' : 'primary'}
            onPress={() => {
              if (navigate) {
                navigate('/rum-monitor');
              }
            }}
        >
            RUM Monitor
        </Button>
        </div>
      {/* <Tabs
        aria-label="DataDesk navbar navigation"
        onSelectionChange={(tab) => {
          const currentTab = window.location.pathname.split('/')[1];

          // push history
          if (currentTab !== tab) {
            setTimeout(() => {
              // check history location
              // console.log(window.location.

              if (navigate) {
                // navigate(`/${tab}`);
              }
            }, 100);
          }
        }}
      >
        <TabList>
          <Item key="404-reports">404 Reports</Item>
          <Item key="rum-dashboard">RUM Dashboard</Item>
          <Item key="sidekick-dashboard">Sidekick Dashboard</Item>
        </TabList>
      </Tabs> */}

    </Provider>

  );
};
export default NavigationTabs;
