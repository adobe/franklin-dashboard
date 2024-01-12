import {
  ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line,
} from 'recharts';
import './LineChart.css'

function getMinMax(data, y_datakey){
  let max = 0;
  data.forEach((item) => {
    const currData = item[y_datakey];
    max = Math.max(max, parseInt(currData, 10));
  })
  return [0, max];
}

export function DashboardLineChart({
  data,
  height = '100%',
  width = '100%',
  title = '',
  x_datakey,
  y_datakey,
}){ 
  return (
    <div style={{
      height,
      width,
    }}>
 <ResponsiveContainer height="100%" width="100%">
      <LineChart
          width={width}
          height={height}
          data={data.slice(1)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_datakey} tickFormatter={(value, index) => { return value.substring(0, 10)}} tick={{fontSize: '12px'}} angle={-45} reversed={true}/>
          <YAxis domain={getMinMax(data, y_datakey)} tickFormatter={(value, index) => { return parseInt(value, 10).toLocaleString('en-US')}} scale='auto' fontSize={'12px'}/>
          <Tooltip formatter={(value, index) => {parseInt(value, 10).toLocaleString('en-US')}} />
          <Legend display={'false'}/>
          <Line type="monotone" dataKey={y_datakey} stroke="#8884d8" activeDot={{ r: 24 }} />
        </LineChart>
      </ResponsiveContainer>
      </div>
)};
