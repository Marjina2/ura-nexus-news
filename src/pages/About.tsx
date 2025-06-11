
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Zap, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">URA</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing news consumption with AI-powered curation and enhancement for modern readers and content creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass-morphism p-8 rounded-xl">
              <Shield className="w-12 h-12 text-ura-green mb-4" />
              <h3 className="text-xl font-bold text-ura-white mb-4">Trusted Sources</h3>
              <p className="text-muted-foreground">
                We aggregate news from verified, credible sources and enhance them with AI to provide deeper insights and context.
              </p>
            </div>
            
            <div className="glass-morphism p-8 rounded-xl">
              <Zap className="w-12 h-12 text-ura-green mb-4" />
              <h3 className="text-xl font-bold text-ura-white mb-4">AI-Enhanced</h3>
              <p className="text-muted-foreground">
                Our advanced AI algorithms analyze, summarize, and provide additional context to help you understand the bigger picture.
              </p>
            </div>
            
            <div className="glass-morphism p-8 rounded-xl">
              <Users className="w-12 h-12 text-ura-green mb-4" />
              <h3 className="text-xl font-bold text-ura-white mb-4">Creator Focused</h3>
              <p className="text-muted-foreground">
                Built for content creators with licensing rights, export options, and embedding tools to power your content strategy.
              </p>
            </div>
            
            <div className="glass-morphism p-8 rounded-xl">
              <Globe className="w-12 h-12 text-ura-green mb-4" />
              <h3 className="text-xl font-bold text-ura-white mb-4">Global Coverage</h3>
              <p className="text-muted-foreground">
                Stay informed with comprehensive coverage of world events, technology, politics, business, and more.
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-ura-white mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At URA, we believe that quality journalism deserves quality presentation. Our mission is to bridge the gap between traditional news reporting and modern content consumption patterns, empowering both readers and creators with intelligent, accessible, and actionable news content.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
