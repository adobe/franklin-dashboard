import { useCallback } from 'react';
import {
  TagGroup, Item, Button, Text,
  Tooltip, TooltipTrigger,
} from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import LogOut from '@spectrum-icons/workflow/LogOut';
import ShareIcon from '@spectrum-icons/workflow/Share';
import { ToastQueue } from '@react-spectrum/toast';
import NavigationTabs from './NavigationTabs.jsx';
import NavbarLogo from './NavbarLogo.jsx';

import { useStore, initStore } from '../../../stores/global.js';

const DashboardNavbar = ({
  hasNavigation = true,
}) => {
  const {
    globalUrl, domainKey, startDate, endDate,
  } = useStore();

  let navigate = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  const copyToClipboard = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);

    const qps = {
      domainkey: domainKey, url: globalUrl, startdate: startDate, enddate: endDate,
    };
    Object.entries(qps).forEach(([k, v]) => {
      params.set(k, v);
    });
    try {
      const permissions = await navigator.permissions.query({ name: 'clipboard-write' });
      if (permissions.state === 'granted' || permissions.state === 'prompt') {
        await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${params.toString()}`);
        ToastQueue.positive('Copied to clipboard', {
          timeout: 3000,
        });
      } else {
        throw new Error("Can't access the clipboard. Check your browser permissions.");
      }
    } catch (error) {
      ToastQueue.negative('Error copying to clipboard', {
        timeout: 3000,
      });

      // alert('Error copying to clipboard:', error);
    }
  }, [domainKey, globalUrl]);

  return (
    <div style={{ padding: '1.5em', display: 'flex' }}
    >
        <NavbarLogo />
        {hasNavigation && <NavigationTabs />}
        {globalUrl && <div style={{
          width: '-webkit-fill-available', minWidth: '300px', display: 'flex', flexDirection: 'row-reverse', padding: '.7em',
        }}>

        <TooltipTrigger delay={0}>
          <Button type="reset" style='outline' variant="negative" onClick={() => {
            initStore();
            navigate('/');
          }}>
            <LogOut/> <Text>Sign Out</Text>
          </Button>
          <Tooltip>Sign out from DataDesk</Tooltip>
        </TooltipTrigger>

        &nbsp;&nbsp;

        <TooltipTrigger delay={0}>
          <Button style='outline' onPress={copyToClipboard}>
              <ShareIcon/> <Text>Share Link</Text>
          </Button>
          <Tooltip>Copy to clipboard a shareable link to this page for {globalUrl}</Tooltip>
        </TooltipTrigger>

        </div>
        }
    </div>
  );
};

export default DashboardNavbar;
