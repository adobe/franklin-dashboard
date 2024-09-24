import React, { useState } from 'react';
import { TagGroup, Item, Button, TextField, Flex } from '@adobe/react-spectrum';

const MultipleTextEditable = ({ label, items, setItems }) => {
  const [newItem, setNewItem] = useState('');

  // Handle removing items
  const onRemove = (keys) => {
    setItems(prevItems => prevItems.filter((item) => !keys.has(item)));
  };

  // Handle adding new item
  const onAddItem = () => {
    if (newItem.trim()) {
        const newItemObject = newItem;
        setItems([...items, newItemObject]);
        setNewItem('');
    }
  };

  return (
    <Flex direction="column" gap="size-200" width="100%">
      <label>{label}</label>

      {/* Render the TagGroup */}
      {items.length > 0 ? (
        <TagGroup
          items={items}
          onRemove={onRemove}
          aria-label="Editable TagGroup example"
        >
          {<Item>{item}</Item>}
        </TagGroup>
      ) : null}

      {/* Text input to add new tags */}
      <Flex direction="row" gap="size-200" alignItems="center">
        <TextField
          value={newItem}
          onChange={setNewItem}
          label="Exclude Source"
          aria-label="Exclude Source"
        />
        <Button variant="primary" onPress={onAddItem}>
          Exclude Source 
        </Button>
      </Flex>
    </Flex>
  );
};

export default MultipleTextEditable;
