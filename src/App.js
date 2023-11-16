import { Grid, minmax, View } from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';
import React, { Suspense } from 'react';
import './App.css';

function App() {
  return (
<Grid
      areas={{
        base: ['header', 'content'],
        M: ['header header', 'sidebar content'],
      }}
      columns={{
        base: [minmax(0, 'auto')],
        M: ['size-3000', minmax(0, 'auto')],
        L: ['size-3000', minmax(0, 'auto')],
      }}
      rows={{
        base: ['size-1700', minmax(0, 'auto')],
        M: ['size-1000', minmax(0, 'auto')],
      }}
      height="100%"
    >
      <View gridArea="header" paddingX="size-200" paddingY={{ base: 'size-100', M: '0px' }}>
        <Suspense fallback={<div>Loading...</div>}>
        </Suspense>
      </View>
      <View
        gridArea="sidebar"
        isHidden={{ base: true, M: false }}
        height="100%"
        overflow="auto"
      >
        <Suspense fallback={<div>Loading...</div>}>
        </Suspense>
      </View>
      <View
        gridArea={{
          base: 'content',
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
        </Suspense>
      </View>
      <Suspense>
      </Suspense>
      <ToastContainer />
    </Grid>
  );
}

export default App;
