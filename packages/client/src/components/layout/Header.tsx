import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CoffeeBean } from '@/components/decorative';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/analyze', label: 'Beanalysis' },
    { href: '/coffees', label: 'Coffees' },
    { href: '/brew', label: 'Brew' },
    { href: '/grinders', label: 'Grinders', requiresAuth: true },
    { href: '/recipes/community', label: 'Community' },
    { href: '/journal', label: 'Journal', requiresAuth: true },
    { href: '/stats', label: 'Stats', requiresAuth: true },
    { href: '/passport', label: 'Passport', requiresAuth: true },
    { href: '/learn', label: 'Learn' },
  ];

  // Filter nav links based on auth status
  const visibleNavLinks = navLinks.filter(link => !link.requiresAuth || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center group-hover:bg-sage/20 transition-colors duration-300">
                <CoffeeBean size={24} color="hsl(var(--sage-dark))" />
              </div>
              {/* Decorative dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              Brew<span className="text-sage">Junkies</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleNavLinks.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  ${isActive(href)
                    ? 'text-sage-dark bg-sage-light/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sage" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2 rounded-xl hover:bg-sage-light/30">
                    <div className="w-7 h-7 rounded-full bg-sage-light flex items-center justify-center">
                      <User className="h-4 w-4 text-sage-dark" />
                    </div>
                    <span className="hidden sm:inline font-medium">{user?.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-sage-light/30">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-xl shadow-soft hover:shadow-soft-lg transition-shadow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {visibleNavLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300
                    ${isActive(href)
                      ? 'text-sage-dark bg-sage-light/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  {label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
