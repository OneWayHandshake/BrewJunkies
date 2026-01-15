import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import { CountryOutline, hasCountryOutline } from '@/components/CountryOutline';

interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  category: string;
  tags: string[];
  excerpt: string | null;
  publishedAt: string | null;
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/education/${slug}`);
        setArticle(response.data.data);
        setError(null);
      } catch (err) {
        setError('Article not found.');
        console.error('Error fetching article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-destructive mb-4">{error || 'Article not found'}</p>
          <Link to="/learn">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Education
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/learn" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Education
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                {article.category.toLowerCase()}
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-start gap-6">
              {article.category === 'LOCATIONS' && hasCountryOutline(article.slug) && (
                <CountryOutline
                  slug={article.slug}
                  size={120}
                  className="text-primary flex-shrink-0 mt-2"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-3">{article.title}</h1>
                {article.subtitle && (
                  <p className="text-xl text-muted-foreground">{article.subtitle}</p>
                )}
              </div>
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />
        </article>
      </div>
    </div>
  );
}

function formatContent(content: string): string {
  // Convert markdown-style content to HTML
  let html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br>');

  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';

  // Fix list items
  html = html.replace(/(<li>.*<\/li>)+/g, (match) => `<ul>${match}</ul>`);

  return html;
}
