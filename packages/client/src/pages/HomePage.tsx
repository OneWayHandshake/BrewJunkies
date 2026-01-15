import { Link } from 'react-router-dom';
import { Coffee, Scan, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-coffee-50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover the Art of
            <span className="text-primary block">Perfect Coffee</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn about coffee origins, analyze your beans with AI, and find the perfect brew
            parameters for every cup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/analyze">
              <Button size="lg" className="gap-2">
                <Scan className="h-5 w-5" />
                Analyze Your Beans
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Brew Better Coffee
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Scan className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI Bean Analysis</CardTitle>
                <CardDescription>
                  Upload a photo of your coffee beans and get instant analysis with roast level,
                  suggested brew parameters, and tasting notes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/analyze" className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Try it now <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Coffee className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Brew Parameters</CardTitle>
                <CardDescription>
                  Get precise brewing recommendations for espresso, pour over, French press, and
                  more. Dial in the perfect cup every time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/coffees" className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Browse coffees <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Coffee Education</CardTitle>
                <CardDescription>
                  Learn about coffee origins, processing methods, roasting, and brewing techniques
                  from our comprehensive guides.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/learn" className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Start learning <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-coffee-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Coffee Game?</h2>
          <p className="text-coffee-200 mb-8 max-w-xl mx-auto">
            Create an account to save your favorite coffees, track your reviews, and get
            personalized brewing recommendations.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
