import React, { useState } from 'react';
import { TextField, Button, Flex } from '@adobe/react-spectrum';

const MultipleTextEditable = ({ label, name, defaultValues = [] }) => {
  const [values, setValues] = useState(defaultValues);

  const handleAddField = () => {
    setValues([...values, '']);
  };

  const handleChange = (index, newValue) => {
    const updatedValues = [...values];
    updatedValues[index] = newValue;
    setValues(updatedValues);
  };

  return (
    <Flex direction="column" gap="size-200">
      {values.map((value, index) => (
        <TextField
          key={index}
          label={`${label} ${index + 1}`}
          value={value}
          onChange={(newValue) => handleChange(index, newValue)}
          name={`${name}[${index}]`}
        />
      ))}
      <Button variant="primary" onPress={handleAddField}>
        Add Another {label}
      </Button>
    </Flex>
  );
};

export default MultipleTextEditable;
