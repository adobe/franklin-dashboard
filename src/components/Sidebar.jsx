import {
  TextField, DateRangePicker, Flex, Switch,
} from '@adobe/react-spectrum';
import React from 'react';

function Sidebar() {
  const [selected, setSelection] = React.useState(false);
  return (
        <Flex direction={'column'} height="100vh" gap='size-100' margin='size-100' >
            <TextField label='Url' description='Enter url for site' ></TextField>

            <Switch isSelected={!selected} onChange={() => {
              setSelection(!selected);
            }}>{!selected ? 'Date' : 'Interval & Offset'}</Switch>

            <DateRangePicker isHidden={selected}/>
            <TextField isHidden={!selected} label="Offset" description="# of Days From from Today"></TextField>
            <TextField isHidden={!selected} label="Interval" description="# of Days Away from Offset"></TextField>

        </Flex>
  );
}

export { Sidebar };
