import { ProgressCircle, defaultTheme, Provider } from '@adobe/react-spectrum';

const DashboardSpinner = ({
  children,
  loading = true,
}) => (
    <Provider theme={defaultTheme}>
        <div style={{
          width: '500px', height: '500px', justifyContent: 'center', display: 'flex', alignItems: 'center',
        }}>
            {
                loading
                  ? <ProgressCircle aria-label="Loading…" isIndeterminate />
                  : children
            }
        </div>
    </Provider>

);

export default DashboardSpinner;
