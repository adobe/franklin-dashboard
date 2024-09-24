import React, { useState } from 'react';
import { TagGroup, Item, Button, TextField, Flex } from '@adobe/react-spectrum';
import { v4 as uuidv4 } from 'uuid'; 

const MultipleTextEditable = ({ label, items, setItems }) => {
  const [newItem, setNewItem] = useState('');

  // Handle removing items
  const onRemove = (keys) => {
    setItems(prevItems => prevItems.filter((item) => !keys.has(item.id)));
  };

  // Handle adding new item
  const onAddItem = () => {
    if (newItem.trim()) {
      const isDuplicate = items.some(item => item.name.toLowerCase() === newItem.toLowerCase());
      if (!isDuplicate) {
        const newItemObject = { id: uuidv4(), name: newItem };
        setItems([...items, newItemObject]);
        setNewItem('');
      }
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
          {item => <Item>{item.name}</Item>}
        </TagGroup>
      ) : null}

      {/* Text input to add new tags */}
      <Flex direction="row" gap="size-200" alignItems="center">
        <TextField
          value={newItem}
          onChange={setNewItem}
          placeholder="Exclude Source"
        />
        <Button variant="primary" onPress={onAddItem}>
          Exclude Source 
        </Button>
      </Flex>
    </Flex>
  );
};

export default MultipleTextEditable;
