import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Flame, Coffee, Cog, History, Users, BookOpen, Loader2, MapPin, FlaskConical } from 'lucide-react';
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
  origins: Globe,
  roasting: Flame,
  brewing: Coffee,
  equipment: Cog,
  history: History,
  culture: Users,
  locations: MapPin,
  science: FlaskConical,
};

const categoryDescriptions: Record<string, string> = {
  origins: 'Explore coffee-growing regions around the world and their unique characteristics.',
  roasting: 'Learn how roasting transforms green beans into the aromatic coffee we love.',
  brewing: 'Master different brewing techniques to get the most out of your coffee.',
  equipment: 'From grinders to brewers, learn about the tools that make great coffee.',
  history: 'Discover the rich history of coffee from ancient times to the modern era.',
  culture: 'Experience coffee culture from around the world.',
  locations: 'Discover the top 50 coffee producing countries with bean types, flavor profiles, and growing regions.',
  science: 'Understand the science behind coffee, from altitude and growing conditions to flavor chemistry.',
};

const categoryTitles: Record<string, string> = {
  origins: 'Coffee Origins',
  roasting: 'Roasting',
  brewing: 'Brewing Methods',
  equipment: 'Equipment',
  history: 'History',
  culture: 'Culture',
  locations: 'Coffee Countries',
  science: 'Coffee Science',
};

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryKey = category?.toUpperCase() || '';
  const Icon = categoryIcons[category || ''] || BookOpen;
  const title = categoryTitles[category || ''] || category;
  const description = categoryDescriptions[category || ''] || `Learn about ${category}`;

  useEffect(() => {
    const fetchArticles = async () => {
      if (!category) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/education?category=${categoryKey}`);
        const data = response.data.data;
        // The API returns grouped data, so we need to extract the category's articles
        setArticles(data[categoryKey] || []);
        setError(null);
      } catch (err) {
        setError('Failed to load articles.');
        console.error('Error fetching category articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [category, categoryKey]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/learn" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Education
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <Icon className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
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
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Link key={article.id} to={`/learn/${article.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    {article.excerpt && (
                      <CardDescription className="line-clamp-2">
                        {article.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">{articles.length} articles in this category</p>
        </div>
      </div>
    </div>
  );
}
