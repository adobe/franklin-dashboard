import DashboardLayout from '../../core/Layout/Layout.jsx';
import { RumDashboardMain } from './RumDashboardMain.jsx';
import './RumDashboardMain.css';

const DashboardRUMView = async () => (
    <DashboardLayout>
        <RumDashboardMain></RumDashboardMain>
    </DashboardLayout>
);

export default DashboardRUMView;
