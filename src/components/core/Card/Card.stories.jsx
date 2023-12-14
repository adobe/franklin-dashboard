import Card from './Card.jsx';

export default {
  title: 'Design System/Core/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const cardDefault = () => (
    <Card>
        Some content
    </Card>
);
