import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useHeartRateDistribution } from '../hooks/useHeartRateDistribution';
import { type PatientRecord } from '../types';

interface HeartRateChartProps {
  patients: PatientRecord[];
  displayIndices: Int32Array | null;
}

export default function HeartRateChart({ patients, displayIndices }: HeartRateChartProps) {
  const chartData = useHeartRateDistribution(patients, displayIndices);

  if (chartData.length === 0) {
    return <div className="text-gray-500 text-center py-10">No data</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
        Heart Rate Distribution
      </h3>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barCategoryGap={1} 
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 12 }} 
              label={{ value: 'bpm', position: 'insideBottomRight', offset: -10, fontSize: 12 }} 
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Number of Patients', angle: -90, position: 'insideLeft', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              fill="#0f766e"
              radius={[4, 4, 0, 0]}
              name="Number of Patients"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}