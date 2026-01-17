import { Link } from 'react-router-dom';
import { Scan, BookOpen, ArrowRight, Sparkles, Globe, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  FloatingBeans,
  CornerBranches,
  WaveDivider,
  WaveDividerSoft,
  OrganicBackground,
  HillsSilhouette,
  CoffeeBean
} from '@/components/decorative';
import { RecentActivityWidget } from '@/components/home/RecentActivityWidget';
import { useAuthStore } from '@/store/authStore';

export function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-cream via-background to-peach/30">
        <FloatingBeans />
        <OrganicBackground />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light/50 text-sage-dark text-sm font-medium mb-8 animate-slide-up">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Coffee Discovery</span>
            </div>

            <h1 className="text-5xl md:text-6.5xl lg:text-7.5xl font-display font-semibold tracking-tight mb-6 animate-slide-up delay-100" style={{ opacity: 0 }}>
              Discover the
              <span className="block text-sage mt-2">Art of Perfect Coffee</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-200 leading-relaxed" style={{ opacity: 0 }}>
              Learn about coffee origins from 50 countries, use Beanalysis to understand your beans,
              and find the perfect brew parameters for every cup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300" style={{ opacity: 0 }}>
              <Link to="/analyze">
                <Button size="lg" className="gap-3 text-base px-8 py-6 rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1">
                  <Scan className="h-5 w-5" />
                  Try Beanalysis
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline" className="gap-3 text-base px-8 py-6 rounded-2xl border-2 hover:bg-sage-light/30 transition-all duration-300 hover:-translate-y-1">
                  <BookOpen className="h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider color="hsl(var(--background))" />
        </div>
      </section>

      {/* Recent Activity for authenticated users */}
      {isAuthenticated && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <RecentActivityWidget />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 md:py-32 relative">
        <CornerBranches className="opacity-40" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4.5xl font-display font-semibold mb-4">
              Everything You Need to
              <span className="text-terracotta block mt-1">Brew Better Coffee</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From Beanalysis to brewing guides, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 - AI Analysis */}
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-sage/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-soft-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sage-light/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Scan className="h-7 w-7 text-sage-dark" />
                </div>
                <CardTitle className="text-xl font-display">Beanalysis</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Upload a photo of your coffee beans and get instant AI analysis with roast level,
                  suggested brew parameters, and tasting notes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/analyze" className="text-sage-dark font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Try it now <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Card 2 - Coffee Countries */}
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-terracotta/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-soft-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-light/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-terracotta-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-7 w-7 text-terracotta" />
                </div>
                <CardTitle className="text-xl font-display">50 Coffee Countries</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Explore coffee origins from around the world. Learn about unique flavor profiles,
                  growing conditions, and regional specialties.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/learn/category/locations" className="text-terracotta font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explore origins <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Card 3 - Education */}
            <Card className="group relative overflow-hidden border-2 border-transparent hover:border-olive/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-soft-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-olive-light/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-olive-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-7 w-7 text-olive" />
                </div>
                <CardTitle className="text-xl font-display">Coffee Education</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Learn about processing methods, roasting science, brewing techniques,
                  and the chemistry behind great coffee.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/learn" className="text-olive font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Start learning <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-16 bg-sage-light/30 relative">
        <WaveDividerSoft className="absolute -top-12 left-0 right-0" color="hsl(var(--sage-light) / 0.3)" flip />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-display font-semibold text-sage-dark">50</div>
              <div className="text-muted-foreground">Coffee Countries</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-display font-semibold text-terracotta">AI</div>
              <div className="text-muted-foreground">Beanalysis</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-display font-semibold text-olive">6+</div>
              <div className="text-muted-foreground">Brew Methods</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-display font-semibold text-coffee-deep">100%</div>
              <div className="text-muted-foreground">Free to Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4.5xl font-display font-semibold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From beans to brew in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-sage via-terracotta to-olive" />

              {/* Step 1 */}
              <div className="text-center relative">
                <div className="w-24 h-24 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-background">
                  <CoffeeBean size={40} color="hsl(var(--sage-dark))" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">Upload Photo</h3>
                <p className="text-muted-foreground">
                  Take a photo of your coffee beans or upload an existing image
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="w-24 h-24 rounded-full bg-terracotta-light flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-background">
                  <Sparkles className="h-10 w-10 text-terracotta" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">Beanalysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes roast level, suggests brew parameters and tasting notes
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="w-24 h-24 rounded-full bg-olive-light flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-background">
                  <Coffee className="h-10 w-10 text-olive" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">Brew Perfect</h3>
                <p className="text-muted-foreground">
                  Follow the recommendations to brew your perfect cup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-sage-light/20 to-sage-dark/90" />

        {/* Hills silhouette */}
        <HillsSilhouette className="absolute bottom-0 left-0 right-0" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4.5xl font-display font-semibold mb-6">
              Ready to Elevate Your
              <span className="text-sage block mt-1">Coffee Journey?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Create an account to save your favorite coffees, track your brewing notes,
              and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-3 text-base px-10 py-6 rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1">
                  Get Started for Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
