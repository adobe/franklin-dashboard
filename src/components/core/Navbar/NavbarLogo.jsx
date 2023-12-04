import { useNavigate } from 'react-router-dom';

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
          @datadesk<span style={{ color: 'blue', fontWeight: 'bold', fontSize: '800' }}>beta</span>
          </h3>
  );
};

export default NavbarLogo;
