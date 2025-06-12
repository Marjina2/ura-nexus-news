
import React from 'react';
import { Brain, Globe, Users, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-ura-green" />,
      title: 'AI-Powered Curation',
      description: 'Our advanced AI algorithms select and enhance the most relevant news stories for you.'
    },
    {
      icon: <Globe className="w-8 h-8 text-ura-green" />,
      title: 'Global Coverage',
      description: 'Stay informed with comprehensive coverage from trusted sources worldwide.'
    },
    {
      icon: <Users className="w-8 h-8 text-ura-green" />,
      title: 'Creator Friendly',
      description: 'Built for content creators with licensing, export, and reuse capabilities.'
    },
    {
      icon: <Zap className="w-8 h-8 text-ura-green" />,
      title: 'Lightning Fast',
      description: 'Optimized for speed with instant article loading and real-time updates.'
    }
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              About URA
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Revolutionizing how you consume and create with news through AI-powered intelligence
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  URA exists to transform the way people discover, consume, and create with news content. 
                  We believe that in an age of information overload, artificial intelligence can help 
                  curate the most relevant, accurate, and engaging stories.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our platform empowers both readers and content creators with tools that make news 
                  consumption more efficient and content creation more impactful.
                </p>
              </div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-ura-green/20 to-card rounded-2xl flex items-center justify-center">
                  <Brain className="w-32 h-32 text-ura-green opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
              What Makes URA Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
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

        {/* Story Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8">
              Our Story
            </h2>
            <div className="text-lg text-muted-foreground space-y-6">
              <p>
                Founded in 2024, URA emerged from a simple observation: people were drowning in 
                information but starving for insight. Traditional news consumption was becoming 
                increasingly fragmented and overwhelming.
              </p>
              <p>
                We envisioned a platform where artificial intelligence could serve as a trusted 
                curator, helping readers discover the stories that matter most while providing 
                creators with the tools they need to build upon quality journalism.
              </p>
              <p>
                Today, URA serves thousands of users daily, from casual readers to professional 
                content creators, all united by a shared desire for smarter, more efficient 
                news consumption.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-4">Quality First</h3>
                <p className="text-muted-foreground">
                  We prioritize accuracy and relevance over quantity, ensuring every curated 
                  piece meets our high standards.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-4">Creator Empowerment</h3>
                <p className="text-muted-foreground">
                  We believe in empowering content creators with the tools and licensing they 
                  need to build successful businesses.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-4">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve our AI technology to provide better experiences 
                  for our users.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
