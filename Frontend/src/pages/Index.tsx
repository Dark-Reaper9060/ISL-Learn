import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Hand, 
  BookOpen, 
  Trophy, 
  Users, 
  Sparkles, 
  Camera,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "AI-Powered Recognition",
    description: "Real-time gesture detection with instant feedback on your signing accuracy",
  },
  {
    icon: Hand,
    title: "Complete Alphabet",
    description: "Learn all 26 ISL alphabet signs with detailed instructions and tips",
  },
  {
    icon: BookOpen,
    title: "Word Library",
    description: "Build vocabulary by learning words through letter combinations",
  },
  {
    icon: Trophy,
    title: "Interactive Quizzes",
    description: "Test your skills with timed challenges and track your progress",
  },
];

const benefits = [
  "Learn at your own pace",
  "Real-time feedback",
  "Track your progress",
  "Free to use",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                <Hand className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                SignSiksha
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/learn">
                <Button variant="ghost">Learn</Button>
              </Link>
              <Link to="/learn">
                <Button variant="hero">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Sign Language Learning</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in">
              Learn{" "}
              <span className="text-primary">Indian Sign Language</span>
              {" "}with AI
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              Master ISL alphabets and words through interactive lessons, 
              real-time gesture recognition, and personalized feedback. 
              Start your journey to fluent signing today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/learn">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/words">
                <Button variant="outline" size="xl" className="gap-2 w-full sm:w-auto">
                  <BookOpen className="w-5 h-5" />
                  Explore Words
                </Button>
              </Link>
            </div>

            {/* Benefits */}
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Everything You Need to Learn ISL
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven 
              learning methods to help you master Indian Sign Language.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: "Choose a Letter", desc: "Select any ISL alphabet to start learning" },
              { step: 2, title: "Watch & Practice", desc: "See the sign description and practice with your camera" },
              { step: 3, title: "Get Feedback", desc: "Our AI recognizes your gesture and gives instant feedback" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full gradient-secondary mx-auto mb-4 flex items-center justify-center text-2xl font-heading font-bold text-secondary-foreground">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center animate-float">
              <Hand className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of learners who are mastering Indian Sign Language 
              with our AI-powered platform. It's free to start!
            </p>
            <Link to="/learn">
              <Button variant="hero" size="xl" className="gap-2">
                Begin Learning Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Hand className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-foreground">SignSiksha</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 SignSiksha. Making ISL accessible to everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
