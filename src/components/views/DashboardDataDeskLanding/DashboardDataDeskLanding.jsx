/* eslint-disable no-unused-vars */
import { Divider } from '@adobe/react-spectrum';
import { intervalOffsetToDates } from '../../../connectors/utils.js';
import DashboardLayout from '../../core/Layout/Layout.jsx';
import DomainKeyForm from '../../forms/DomainKeyForm/DomainKeyForm.jsx';
import Card from '../../core/Card/Card.jsx';
import { useStore, initStore } from '../../../stores/global.js';

const DashboardDataDeskLanding = () => {
  const {
    setDomainKey,
    setGlobalUrl,
    domainkey,
  } = useStore();

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
                let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (timezone === 'null' || timezone === 'undefined' || timezone == null) timezone = '';
                document.location.href = `/rum-checkpoint-urls?url=${formGlobalKey}&domainkey=${formDomainKey}&startdate=${dates.start}&enddate=${dates.end}&timezone=${timezone}&source=.form`;
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
