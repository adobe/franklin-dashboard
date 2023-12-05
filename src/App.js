import { Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import { lightTheme, Provider, Tabs, TabList, TabPanels, Item, Text, Divider} from '@adobe/react-spectrum';
import HomeIcon from '@spectrum-icons/workflow/Home';
import ChartIcon from '@spectrum-icons/workflow/GraphTrend'
import { useState } from 'react';
import { Home } from "components/Home";
import { Filter } from 'components/Filters';

function AppTabs() {
  let { pathname } = useLocation();

  return (
    <Tabs position={'fixed'} isEmphasized selectedKey={pathname}>
      <TabList aria-label="Tabs">
        <Item key="/" href="/"><HomeIcon></HomeIcon><Text>Home</Text></Item>
        <Item key="/perf" href="/perf"><ChartIcon></ChartIcon><Text>Performance Monitor</Text></Item>
      </TabList>
      <TabPanels>
        <Item key="/">
          <Home />
        </Item>
        <Item key="/perf">
          <Filter />
        </Item>
      </TabPanels>
    </Tabs>
  );
}

function App() {
  let navigate = useNavigate();
  return (
    <Provider navigate={navigate} theme={lightTheme} colorScheme='light'>
      <Routes>
        <Route path="/" element={<AppTabs />}>
          <Route index element={<Home />} />
          <Route path="/perf" element={<Filter />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
