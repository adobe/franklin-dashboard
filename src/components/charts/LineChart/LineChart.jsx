import {
  ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line,
} from 'recharts';
import './LineChart.css'

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
          <YAxis scale='auto'/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={y_datakey} stroke="#8884d8" activeDot={{ r: 24 }} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
      </div>
)};
