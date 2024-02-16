import {
  ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line,
} from 'recharts';
import './LineChart.css';

function getMinMax(data, y_datakey) {
  let max = 0;
  data.forEach((item) => {
    const currData = item[y_datakey];
    max = Math.max(max, parseInt(currData, 10));
  });
  return [0, max];
}

export function DashboardLineChart({
  data,
  height = '75%',
  width = '100%',
  x_datakey,
  y_datakey,
}) {
  return (
    <div style={{
      height,
      width,
    }}>
 <ResponsiveContainer height="100%" width="100%">
      <LineChart
          width={width}
          height={height}
          data={data}
        >
          <XAxis type={'category'} dataKey={x_datakey} tickFormatter={(value, index) => new Date(value).toLocaleDateString('en-US')} tick={{ fontSize: '12px' }} angle={-45} reversed={true}/>
          <YAxis domain={getMinMax(data, y_datakey)} tickFormatter={(value, index) => parseInt(value, 10).toLocaleString('en-US')} scale='auto' fontSize={'12px'}/>
          <Tooltip formatter={(value, index) => parseInt(value, 10).toLocaleString('en-US')} />
          <Line type="monotone" dataKey={y_datakey} strokeWidth={3} stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      </div>
  );
}
