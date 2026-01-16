import { Coffee, Globe, Store, Flame, Sparkles, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface PassportStatsData {
  totalCoffees: number;
  totalOrigins: number;
  totalRoasters: number;
  totalRoastLevels: number;
  totalTastingNotes: number;
  totalReviews: number;
}

interface PassportStatsProps {
  stats: PassportStatsData | null;
}

export function PassportStats({ stats }: PassportStatsProps) {
  const statItems = [
    { icon: Coffee, label: 'Coffees Tried', value: stats?.totalCoffees || 0, color: 'text-sage' },
    { icon: Globe, label: 'Origins', value: stats?.totalOrigins || 0, color: 'text-blue-500' },
    { icon: Store, label: 'Roasters', value: stats?.totalRoasters || 0, color: 'text-terracotta' },
    { icon: Flame, label: 'Roast Levels', value: `${stats?.totalRoastLevels || 0}/5`, color: 'text-orange-500' },
    { icon: Sparkles, label: 'Tasting Notes', value: stats?.totalTastingNotes || 0, color: 'text-purple-500' },
    { icon: Star, label: 'Reviews', value: stats?.totalReviews || 0, color: 'text-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statItems.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
