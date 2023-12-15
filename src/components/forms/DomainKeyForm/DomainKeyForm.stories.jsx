import { Provider, defaultTheme } from '@adobe/react-spectrum';
import DomainKeyForm from './DomainKeyForm.jsx';

export default {
  title: 'Design System/Forms/DomainKeyForm',
  component: DomainKeyForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const domainKeyFormDefault = () => (
    <Provider theme={defaultTheme}>
        <DomainKeyForm onValidForm={({
          domainkey,
          inputUrl,
        }) => {
          // eslint-disable-next-line
          console.log('domainKey', domainkey);
          // eslint-disable-next-line
          console.log('inputUrl', inputUrl);
        }} />
    </Provider>
);
