import {
  ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line,
} from 'recharts';

const DashboardLineChart = ({
  data,
  height = window.innerHeight * 0.5,
  width = window.innerWidth * 0.5,
  title = '',
  datakey = 'AVGLCP',
  domain = 'www.adobe.com',
  syncId = 'anyId',
}) => (
    <div style={{
      height,
      width,
    }}>
 <ResponsiveContainer width="100%" height="100%">

      <LineChart
          title='RUM Performance Monitor'
          width={500}
          height={300}
          data={data}
          syncId={syncId}
          margin={{
            top: 66,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <text x={500 / 2} y={20} fill="black" textAnchor="middle" dominantBaseline="central">
            <tspan fontSize="30">{title}</tspan>
            <tspan fontSize={20} x={500 / 2} y={50}>{domain}</tspan>
        </text>

          <br />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={datakey} stroke="#8884d8" activeDot={{ r: 24 }} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>

);
export default DashboardLineChart;
