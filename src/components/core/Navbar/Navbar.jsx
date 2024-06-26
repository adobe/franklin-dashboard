/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import { useEffect } from 'react';
import {
  Button, Text, Tooltip, TooltipTrigger,
} from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import LogOut from '@spectrum-icons/workflow/LogOut';
import ShareIcon from '@spectrum-icons/workflow/Share';
import { ToastQueue } from '@react-spectrum/toast';
import { parseDate } from '@internationalized/date';
import { getDataDates } from '../../../connectors/utils.js';
import NavigationTabs from './NavigationTabs.jsx';
// import NavbarLogo from './NavbarLogo.jsx';
import { useStore, initStore } from '../../../stores/global.js';

const DashboardNavbar = ({
  hasNavigation = true,
}) => {
  const {
    globalUrl, domainKey, startDate, endDate, dataEndpoint,
  } = useStore();

  useEffect(() => {

  }, [startDate, endDate, globalUrl, domainKey]);

  let navigate = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  const copyToClipboard = async () => {
    const params = new URLSearchParams();
    const currDates = getDataDates();
    const currStart = currDates.start ? parseDate(currDates.start) : null;
    const currEnd = currDates.end ? parseDate(currDates.end) : null;
    let timeZone = new URLSearchParams(window.location.search).get('timezone');
    if (timeZone === 'null' || timeZone === 'undefined' || timeZone == null) timeZone = '';
    if (timeZone === '') timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const qps = {
      domainkey: domainKey,
      url: globalUrl,
      startdate: currStart || startDate,
      enddate: currEnd || endDate,
      timezone: timeZone || '',
    };

    if (!Object.entries) {
      Object.entries = (obj) => Object.keys(obj).map((key) => [key, obj[key]]);
    }

    Object.entries(qps).forEach(([k, v]) => {
      params.set(k, v);
    });

    try {
      if (navigator.clipboard) {
        // Check for Clipboard API support
        await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${params.toString()}`);
        ToastQueue.positive('Copied to clipboard', {
          timeout: 3000,
        });
      } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        document.body.appendChild(textArea);
        textArea.select();

        // Use newer document.execCommand('copy') method
        const successful = document.execCommand('copy');
        if (successful) {
          ToastQueue.positive('Copied to clipboard', {
            timeout: 3000,
          });
        } else {
          throw new Error("Couldn't copy to clipboard. Check your browser permissions.");
        }

        document.body.removeChild(textArea);
      } else {
        throw new Error("Clipboard API and document.execCommand('copy') not supported");
      }
    } catch (error) {
      ToastQueue.negative('Error copying to clipboard', {
        timeout: 3000,
      });
    }
  };

  return (
    <div>
    <div style={{
      padding: '1.5em', display: 'block', backgroundColor: 'red', color: 'white', fontWeight: 'bold', textAlign: 'center',
    }}>https://data.aem.live is deprecated.  Ask datadesk or your Adobe contact for your RUM Explorer URL.</div>
    <div style={{ padding: '1.5em', display: 'flex' }}
    >
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
    </div>
  );
};

export default DashboardNavbar;
