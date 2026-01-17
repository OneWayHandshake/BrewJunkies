import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface TastingNoteCount {
  note: string;
  count: number;
}

interface TopTastingNotesProps {
  data: TastingNoteCount[];
}

export function TopTastingNotes({ data }: TopTastingNotesProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Tasting Notes</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Tasting Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 8).map((item, index) => (
            <div key={item.note} className="flex items-center gap-3">
              <span className="text-sm font-medium w-24 truncate">
                {item.note}
              </span>
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
