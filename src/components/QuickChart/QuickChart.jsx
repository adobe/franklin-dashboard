import { useState, useEffect, useRef } from 'react';
import config from './chartServiceConfig.js';

const useImageLoaded = () => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef();

  const onLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      onLoad();
    }
  });

  return [ref, loaded, onLoad];
};

const QuickChart = ({
  offset = 1,
  interval = 90,
  domainKey = null,
  url = null,
}) => {
  const chartConfig = encodeURIComponent(JSON.stringify(config.chartDisplay));
  const chartUri = `${config.endpoint}?offset=${offset}&interval=${interval}&url=${url}&domainkey=${domainKey}&chart=${chartConfig}`;
  const [ref, loaded, onLoad] = useImageLoaded();

  return (

    <>
    {!loaded && <>Loading ...</>}
    <img ref={ref} onLoad={onLoad} src={chartUri} alt="" />
    </>
  );
};

export default QuickChart;
