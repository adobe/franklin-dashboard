import {
  IllustratedMessage,
  Heading,
  Content,
} from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';

const NoDataSkeleton = () => (
        <IllustratedMessage margin="auto">
            <NotFound />
            <Heading>No results</Heading>
            <Content>Use Filters</Content>
        </IllustratedMessage>
);

export default NoDataSkeleton;
