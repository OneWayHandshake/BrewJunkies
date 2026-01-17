import { ReactNode } from 'react';
import { Coffee, FileText, Settings, Star, Globe, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        {icon || <Coffee className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        action.href ? (
          <Link to={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}

// Pre-built empty states for common scenarios

export function EmptyBrewLogs() {
  return (
    <EmptyState
      icon={<Coffee className="h-10 w-10 text-muted-foreground" />}
      title="No brews yet"
      description="Start tracking your coffee journey by logging your first brew."
      action={{ label: 'Log Your First Brew', href: '/journal/new' }}
    />
  );
}

export function EmptyCoffees() {
  return (
    <EmptyState
      icon={<Globe className="h-10 w-10 text-muted-foreground" />}
      title="No coffees found"
      description="Discover and add coffees to your collection to keep track of your favorites."
      action={{ label: 'Browse Coffees', href: '/coffees' }}
    />
  );
}

export function EmptyRecipes() {
  return (
    <EmptyState
      icon={<FileText className="h-10 w-10 text-muted-foreground" />}
      title="No recipes"
      description="Create your first brew recipe or explore community recipes."
      action={{ label: 'Browse Recipes', href: '/recipes/community' }}
    />
  );
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon={<Star className="h-10 w-10 text-muted-foreground" />}
      title="No favorites yet"
      description="Heart the coffees you love to add them to your favorites."
      action={{ label: 'Discover Coffees', href: '/coffees' }}
    />
  );
}

export function EmptyGrinders() {
  return (
    <EmptyState
      icon={<Settings className="h-10 w-10 text-muted-foreground" />}
      title="No grinders added"
      description="Add your grinder to start tracking dial-in settings for different coffees."
      action={{ label: 'Add Your First Grinder', href: '/grinders' }}
    />
  );
}

export function EmptyStats() {
  return (
    <EmptyState
      icon={<Clock className="h-10 w-10 text-muted-foreground" />}
      title="No stats yet"
      description="Log some brews to see your coffee statistics and trends."
      action={{ label: 'Log a Brew', href: '/journal/new' }}
    />
  );
}

export function EmptyCommunityRecipes() {
  return (
    <EmptyState
      icon={<Users className="h-10 w-10 text-muted-foreground" />}
      title="No community recipes"
      description="Be the first to share a recipe with the community!"
      action={{ label: 'Create a Recipe', href: '/brew' }}
    />
  );
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Globe className="h-10 w-10 text-muted-foreground" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try a different search term.`}
    />
  );
}

export function EmptyLearn() {
  return (
    <EmptyState
      icon={<BookOpen className="h-10 w-10 text-muted-foreground" />}
      title="Start learning"
      description="Explore our educational content to become a coffee expert."
      action={{ label: 'Browse Topics', href: '/learn' }}
    />
  );
}

// Illustrated empty states with decorative elements

export function IllustratedEmptyState({
  type,
}: {
  type: 'brews' | 'coffees' | 'recipes' | 'grinders' | 'stats';
}) {
  const configs = {
    brews: {
      icon: <Coffee className="h-12 w-12 text-primary" />,
      title: 'Your coffee journey starts here',
      description:
        'Log your first brew to start tracking your progress and discovering what works best for you.',
      action: { label: 'Log Your First Brew', href: '/journal/new' },
      decoration: (
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
      ),
    },
    coffees: {
      icon: <Globe className="h-12 w-12 text-terracotta" />,
      title: 'Explore the world of coffee',
      description:
        'Discover coffees from around the world and add your favorites to your collection.',
      action: { label: 'Browse Coffees', href: '/coffees' },
      decoration: (
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-terracotta/10 rounded-full blur-2xl" />
      ),
    },
    recipes: {
      icon: <FileText className="h-12 w-12 text-sage" />,
      title: 'Create your perfect brew',
      description:
        'Build and save your brewing recipes, or explore what others have created.',
      action: { label: 'Explore Recipes', href: '/recipes/community' },
      decoration: (
        <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-sage/10 rounded-full blur-2xl" />
      ),
    },
    grinders: {
      icon: <Settings className="h-12 w-12 text-olive" />,
      title: 'Dial in your grind',
      description:
        'Add your grinder and start tracking the perfect settings for each coffee.',
      action: { label: 'Add Grinder', href: '/grinders' },
      decoration: (
        <div className="absolute -top-2 -right-6 w-16 h-16 bg-olive/10 rounded-full blur-xl" />
      ),
    },
    stats: {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: 'Track your progress',
      description:
        'Log brews to unlock insights about your coffee habits and preferences.',
      action: { label: 'Start Logging', href: '/journal/new' },
      decoration: (
        <div className="absolute -bottom-6 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      ),
    },
  };

  const config = configs[type];

  return (
    <div className="relative flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
      {config.decoration}
      <div className="relative z-10">
        <div className="w-24 h-24 rounded-full bg-muted/30 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto border border-border/50">
          {config.icon}
        </div>
        <h3 className="text-xl font-display font-semibold mb-3">{config.title}</h3>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          {config.description}
        </p>
        <Link to={config.action.href}>
          <Button size="lg" className="rounded-xl">
            {config.action.label}
          </Button>
        </Link>
      </div>
    </div>
  );
}
