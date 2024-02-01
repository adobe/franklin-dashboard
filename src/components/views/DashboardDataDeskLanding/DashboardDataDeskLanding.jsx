import { Divider } from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../core/Layout/Layout.jsx';
import DomainKeyForm from '../../forms/DomainKeyForm/DomainKeyForm.jsx';
import Card from '../../core/Card/Card.jsx';
import { useStore, initStore } from '../../../stores/global.js';
import { intervalOffsetToDates } from 'connectors/utils.js';

const DashboardDataDeskLanding = () => {
  const {
    setDomainKey,
    setGlobalUrl,
    setReportUrl,
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
                      initStore();
                      setGlobalUrl(formGlobalKey);
                      setDomainKey(formDomainKey);
                      const dates = intervalOffsetToDates(0, 30);
                      navigate(`rum-dashboard?url=${formGlobalKey}&domainkey=${formDomainKey}&startdate=${dates['start']}&enddate=${dates['end']}`);
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
