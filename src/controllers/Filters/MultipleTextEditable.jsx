import React, { useState } from 'react';
import { TagGroup, Item, Button, TextField, Flex } from '@adobe/react-spectrum';

const MultipleTextEditable = ({ defaultItems }) => {
  const [items, setItems] = useState(defaultItems);
  const [newItem, setNewItem] = useState('');

  // Handle removing items
  const onRemove = (keys) => {
    setItems(prevItems => prevItems.filter((item) => !keys.has(item.id)));
  };

  // Handle adding new item
  const onAddItem = () => {
    if (newItem.trim()) {
      const newItemObject = { id: items.length + 1, name: newItem };
      setItems([...items, newItemObject]);
      setNewItem('');
    }
  };

  return (
    <Flex direction="column" gap="size-200" width="100%">
      {/* Render the TagGroup */}
      <TagGroup
        items={items}
        onRemove={onRemove}
        aria-label="Editable TagGroup example"
      >
        {item => <Item>{item.name}</Item>}
      </TagGroup>

      {/* Text input to add new tags */}
      <Flex direction="row" gap="size-200" alignItems="center">
        <TextField
          value={newItem}
          onChange={setNewItem}
          placeholder="Add new item"
        />
        <Button variant="primary" onPress={onAddItem}>
          Add
        </Button>
      </Flex>
    </Flex>
  );
};

export default MultipleTextEditable;
