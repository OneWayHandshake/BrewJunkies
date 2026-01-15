import { Link } from 'react-router-dom';
import { Coffee, Menu, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Coffee className="h-6 w-6 text-primary" />
            <span>Coffee Education</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/coffees" className="text-sm font-medium hover:text-primary transition-colors">
              Coffees
            </Link>
            <Link to="/analyze" className="text-sm font-medium hover:text-primary transition-colors">
              Analyze Beans
            </Link>
            <Link to="/learn" className="text-sm font-medium hover:text-primary transition-colors">
              Learn
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
