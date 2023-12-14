import { TagGroup, Item, Button } from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import NavigationTabs from './NavigationTabs.jsx';
import NavbarLogo from './NavbarLogo.jsx';
import { useStore, initStore } from '../../../stores/global.js';

const DashboardNavbar = ({
  hasNavigation = true,
}) => {
  const { globalUrl } = useStore();

  let navigate = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  return (
    <div style={{ padding: '1.5em', display: 'flex' }}
    >
        <NavbarLogo />
        {hasNavigation && <NavigationTabs />}
        {globalUrl && <div style={{
          float: 'right', minWidth: '300px', display: 'flex', padding: '.7em',
        }}>
          <TagGroup aria-label="Static TagGroup items example" >
           <Item>{globalUrl}</Item>
        </TagGroup>
        <Button onClick={() => {
          initStore();
          navigate('/');
        }}>
          Sign Out
        </Button>
        </div>
        }
    </div>
  );
};

export default DashboardNavbar;
