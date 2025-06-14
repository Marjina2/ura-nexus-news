
import React from 'react';
import { Users, MessageCircle, Award, Share } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Community = () => {
  const communityFeatures = [
    {
      icon: <Users className="w-8 h-8 text-ura-green" />,
      title: 'Creator Network',
      description: 'Connect with fellow content creators and share experiences'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-ura-green" />,
      title: 'Discussion Forums',
      description: 'Join discussions about industry trends and best practices'
    },
    {
      icon: <Award className="w-8 h-8 text-ura-green" />,
      title: 'Recognition Program',
      description: 'Get recognized for your contributions to the community'
    },
    {
      icon: <Share className="w-8 h-8 text-ura-green" />,
      title: 'Content Sharing',
      description: 'Share your work and get feedback from the community'
    }
  ];

  const topCreators = [
    { name: 'Sarah Johnson', specialty: 'Tech News', posts: 45, badge: 'Expert' },
    { name: 'Mike Chen', specialty: 'Politics', posts: 38, badge: 'Contributor' },
    { name: 'Emma Davis', specialty: 'Healthcare', posts: 42, badge: 'Expert' },
    { name: 'Alex Rodriguez', specialty: 'Business', posts: 29, badge: 'Rising Star' }
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Creator Community
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join a thriving community of content creators and industry professionals
            </p>
          </div>
        </section>

        {/* Community Features */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Community Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {communityFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover-lift">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Top Creators */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Top Community Contributors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCreators.map((creator, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-ura-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-ura-green">{creator.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{creator.specialty}</p>
                    <p className="text-sm mb-3">{creator.posts} posts</p>
                    <Badge className="bg-ura-green/20 text-ura-green">{creator.badge}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Community Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-ura-green mb-2">2,500+</div>
                <div className="text-muted-foreground">Active Creators</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-ura-green mb-2">15,000+</div>
                <div className="text-muted-foreground">Community Posts</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-ura-green mb-2">50+</div>
                <div className="text-muted-foreground">Countries Represented</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with creators, share your work, and grow your audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-3 text-lg">
                Join Community
              </Button>
              <Button variant="outline" className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black px-8 py-3 text-lg">
                Browse Discussions
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
