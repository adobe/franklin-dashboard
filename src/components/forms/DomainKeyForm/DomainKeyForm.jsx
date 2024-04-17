import { useState } from 'react';

import {
  // eslint-disable-next-line no-unused-vars
  TextField, Form, ButtonGroup, Button,
} from '@adobe/react-spectrum';

const DomainKeyForm = ({
  onValidForm,
}) => {
  const [inputUrlError, setInputUrlError] = useState(null);
  const [domainKeyError, setDomainKeyError] = useState(null);

  const onFormSubmit = (e) => {
    e.preventDefault();

    // Get form data as an object.
    const {
      domainkey,
    } = Object.fromEntries(new FormData(e.currentTarget));

    let {
      inputUrl,
    } = Object.fromEntries(new FormData(e.currentTarget));

    // only take the first domain before a comma in case multiple domains were entered
    // eslint-disable-next-line prefer-destructuring
    inputUrl = inputUrl.split(',')[0];

    let errorsCount = 0;

    if (domainkey.length === 0) {
      setDomainKeyError('Domain Key must be set');
      errorsCount += 1;
    } else {
      setDomainKeyError(null);
    }

    if (inputUrl.length === 0) {
      errorsCount += 1;
      setInputUrlError('Input URL must be set');
    } else {
      setInputUrlError(null);
    }

    if (errorsCount === 0) {
      onValidForm({
        domainkey,
        inputUrl,
      });
    }
  };

  return (
        <Form onSubmit={onFormSubmit} method='get'>
            <TextField
                name='inputUrl'
                label="Url"
                autoFocus
                isRequired
                isInvalid={!!inputUrlError}
                errorMessage={inputUrlError}
            />
            <TextField
                name='domainkey'
                label='Domain Key'
                autoFocus
                isInvalid={!!domainKeyError}
                errorMessage={domainKeyError}
                isRequired
            />

            <br />

            <ButtonGroup>
                <Button type="submit" variant="cta" UNSAFE_style={{
                  cursor: 'pointer',
                }}>Access DataDesk</Button>
            </ButtonGroup>
        </Form>
  );
};

export default DomainKeyForm;
