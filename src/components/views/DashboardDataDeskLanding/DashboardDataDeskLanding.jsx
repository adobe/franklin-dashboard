import { Divider } from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../core/Layout/Layout.jsx';
import DomainKeyForm from '../../forms/DomainKeyForm/DomainKeyForm.jsx';
import Card from '../../core/Card/Card.jsx';
import { useStore } from '../../../stores/global.js';

const DashboardDataDeskLanding = () => {
  const {
    setDomainKey,
    setGlobalUrl,
    domainkey,
  } = useStore();

  let navigate = null;

  try {
    navigate = useNavigate();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('useNavigate not available');
  }

  return (
    <DashboardLayout hasNavigation={false}>
        <div style={{ width: '100%', marginTop: '4em' }}>
            <div style={{ maxWidth: '500px', margin: 'auto' }}>
                <h2>Welcome to DataDesk</h2>
                <Divider />
                <br />
                <Card>
                <DomainKeyForm
                    onValidForm={({
                      inputUrl: formGlobalKey,
                      domainkey: formDomainKey,
                    }) => {
                      setGlobalUrl(formGlobalKey);
                      setDomainKey(formDomainKey);
                      navigate('/rum-dashboard');
                    }}
                />
                <span>{domainkey}</span>
                </Card>

            </div>
        </div>

    </DashboardLayout>
  );
};

export default DashboardDataDeskLanding;
