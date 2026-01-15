import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Flame, Coffee, Cog, History, Users, BookOpen, Loader2, MapPin, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/services/api';

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  ORIGINS: Globe,
  ROASTING: Flame,
  BREWING: Coffee,
  EQUIPMENT: Cog,
  HISTORY: History,
  CULTURE: Users,
  LOCATIONS: MapPin,
  SCIENCE: FlaskConical,
};

const categoryDescriptions: Record<string, string> = {
  ORIGINS: 'Explore coffee-growing regions around the world and their unique characteristics.',
  ROASTING: 'Learn how roasting transforms green beans into the aromatic coffee we love.',
  BREWING: 'Master different brewing techniques to get the most out of your coffee.',
  EQUIPMENT: 'From grinders to brewers, learn about the tools that make great coffee.',
  HISTORY: 'Discover the rich history of coffee from ancient times to the modern era.',
  CULTURE: 'Experience coffee culture from around the world.',
  LOCATIONS: 'Discover the top 50 coffee producing countries with bean types, flavor profiles, and growing regions.',
  SCIENCE: 'Understand the science behind coffee, from altitude and growing conditions to flavor chemistry.',
};

const categoryTitles: Record<string, string> = {
  ORIGINS: 'Coffee Origins',
  ROASTING: 'Roasting',
  BREWING: 'Brewing Methods',
  EQUIPMENT: 'Equipment',
  HISTORY: 'History',
  CULTURE: 'Culture',
  LOCATIONS: 'Coffee Countries',
  SCIENCE: 'Coffee Science',
};

export function EducationPage() {
  const [articles, setArticles] = useState<Record<string, Article[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/education');
        setArticles(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load educational content.');
        console.error('Error fetching education:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const categories = Object.keys(articles).length > 0
    ? Object.keys(articles)
    : Object.keys(categoryDescriptions);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Coffee Education</h1>
          <p className="text-muted-foreground">
            Everything you need to know about coffee, from bean to cup.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-destructive mb-4">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || BookOpen;
              const categoryArticles = articles[category] || [];

              return (
                <Card key={category} className="hover:shadow-lg transition-shadow">
                  <Link to={`/learn/category/${category.toLowerCase()}`}>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle>{categoryTitles[category] || category}</CardTitle>
                          <CardDescription>
                            {categoryDescriptions[category] || `Learn about ${category}`}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Link>
                  <CardContent>
                    {categoryArticles.length > 0 ? (
                      <ul className="space-y-3">
                        {categoryArticles.slice(0, 3).map((article) => (
                          <li key={article.id}>
                            <Link
                              to={`/learn/${article.slug}`}
                              className="block group"
                            >
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {article.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                        {categoryArticles.length > 3 && (
                          <li>
                            <Link
                              to={`/learn/category/${category.toLowerCase()}`}
                              className="text-sm text-primary hover:underline"
                            >
                              View all {categoryArticles.length} articles...
                            </Link>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Content coming soon...
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center text-muted-foreground">
          <p className="text-sm">
            {Object.values(articles).flat().length} articles available
          </p>
        </div>
      </div>
    </div>
  );
}
