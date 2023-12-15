import {
  ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ReferenceLine 
} from 'recharts';

const DashboardLineChart = ({
  data,
  height = window.innerHeight * 0.35,
  width = window.innerWidth * 0.35,
  title = '',
  x_datakey,
  y_datakey,
  good_score, 
  bad_score, 
}) => (
    <div style={{
      height,
      width,
    }}>
 <ResponsiveContainer width="100%" height="100%">

      <LineChart
          title='RUM Performance Monitor'
          width='100%'
          height='100%'
          data={data}
          margin={{
            top: 66,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <text x={500 / 2} y={20} fill="black" textAnchor="middle" dominantBaseline="central">
            <tspan fontSize="25">{title}</tspan>
            <tspan fontSize={15} x={500 / 2} y={50}>{data[0].url}</tspan>
        </text>

          <br />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_datakey} tickFormatter={(value, index) => { return value.substring(2)}} tick={{fontSize: '12px'}} angle={-45} />
          <ReferenceLine y={good_score} label="Healthy" stroke="green" strokeDasharray="3 3" />
          <ReferenceLine y={bad_score} label="Needs Improvement" stroke="red" strokeDasharray="3 3" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={y_datakey} stroke="#8884d8" activeDot={{ r: 24 }} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>

);
export default DashboardLineChart;
