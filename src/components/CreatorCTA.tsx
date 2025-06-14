
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Zap, DollarSign, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatorCTA = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: FileText,
      title: "Premium Content Library",
      description: "Access thousands of AI-enhanced articles for your platform"
    },
    {
      icon: Zap,
      title: "Instant Licensing",
      description: "One-click licensing with transparent pricing and usage rights"
    },
    {
      icon: DollarSign,
      title: "Flexible Pricing",
      description: "Pay per article or subscribe for unlimited access"
    },
    {
      icon: Users,
      title: "Creator Community",
      description: "Join 500+ content creators already using our platform"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-ura-black via-green-900/5 to-ura-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-ura-green/20 rounded-full px-4 py-2 mb-6">
                <Users className="w-4 h-4 text-ura-green" />
                <span className="text-sm text-ura-white">For Content Creators</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-ura-white mb-6">
                License our premium content for 
                <span className="gradient-text"> your platform</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your content strategy with our AI-enhanced articles. 
                Perfect for blogs, newsletters, social media, and more.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-ura-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-ura-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ura-white mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="bg-ura-green text-ura-black hover:bg-ura-green-hover"
                onClick={() => navigate('/pricing')}
              >
                Start Using Content
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black"
                onClick={() => navigate('/pricing')}
              >
                View Pricing Plans
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by content creators at:
              </p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-lg font-bold">TechCrunch</div>
                <div className="text-lg font-bold">Medium</div>
                <div className="text-lg font-bold">Substack</div>
                <div className="text-lg font-bold">WordPress</div>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Mock License Card */}
                  <div className="bg-gradient-to-r from-ura-green/10 to-blue-500/10 border border-ura-green/20 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-ura-white">Content License</h4>
                      <span className="text-ura-green font-bold">$12.99</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      "AI Revolution Reshapes Global Economy" - Tech Category
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Full commercial rights</span>
                      <span>Valid for 1 year</span>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-ura-white">This Month's Usage</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Articles Licensed</span>
                        <span className="text-ura-green font-semibold">23 / 50</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-ura-green h-2 rounded-full" style={{ width: '46%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Revenue Projection */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h6 className="text-sm font-semibold text-ura-white mb-2">Estimated Revenue Impact</h6>
                    <p className="text-lg font-bold text-ura-green">+127% engagement</p>
                    <p className="text-xs text-muted-foreground">Based on similar content creators</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-ura-green/20 rounded-full blur-xl animate-float" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorCTA;
