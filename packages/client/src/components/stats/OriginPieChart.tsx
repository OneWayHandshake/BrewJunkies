import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface OriginCount {
  origin: string;
  count: number;
  percentage: number;
}

interface OriginPieChartProps {
  data: OriginCount[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(220, 70%, 50%)',
  'hsl(150, 60%, 45%)',
  'hsl(45, 90%, 50%)',
  'hsl(280, 60%, 55%)',
  'hsl(0, 70%, 55%)',
  'hsl(180, 60%, 45%)',
  'hsl(30, 80%, 50%)',
  'hsl(200, 70%, 50%)',
  'hsl(340, 65%, 55%)',
];

export function OriginPieChart({ data }: OriginPieChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Origins</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Origins</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="count"
              nameKey="origin"
              label={({ origin, percentage }) =>
                percentage >= 10 ? `${origin} (${percentage}%)` : ''
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} brews (${props.payload.percentage}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
