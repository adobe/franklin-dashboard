import { Grid, minmax, View } from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';
import React, { Suspense } from 'react';
import './App.css';
import { Sidebar } from 'components/Sidebar';

function App() {
  return (
<Grid areas={['sidebar content']} columns={['1fr', '6fr']} rows={['auto']} height="100vh" gap="size-100">
    <View gridArea="sidebar">
      <Sidebar></Sidebar>
    </View>

    <View backgroundColor="purple-600" gridArea="content">

    </View>
</Grid>
  );
}

export default App;
