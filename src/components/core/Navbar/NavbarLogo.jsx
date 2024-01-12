import { useNavigate } from 'react-router-dom';
import { Image } from '@adobe/react-spectrum';

const NavbarLogo = () => {
  let navigate = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  return (
        <h3 className="navbar-logo" style={{ display: 'block', marginRight: '2em' }} onClick={() => {
          if (navigate) {
            navigate('/');
          }
        }}>
          @Datadesk
          </h3>
  );
};

export default NavbarLogo;
