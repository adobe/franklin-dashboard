import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';
import { useStore } from 'stores/global';

export function DashboardStackedBarChart({
  data,
  x_datakey,
  y_datakey,
}){
  const { globalUrl } = useStore();
  return (
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width="100%"
          height="100%"
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x_datakey} tickFormatter={(value, index) => { return value.substring(0, 10)}} tick={{fontSize: '12px'}} angle={-45} reversed={true}/>
          <YAxis label={{ value: 'Pageviews', angle: -90, position: 'insideLeft' }} />
          <Bar dataKey={y_datakey} fill="#8884d8">
            <LabelList dataKey={y_datakey} position="top" />
          </Bar>
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>

)};
