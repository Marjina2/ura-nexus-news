
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const About = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-scale-in text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              About Pulsee
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing news consumption with AI-powered insights and real-time updates
            </p>
          </div>

          <div className="space-y-12">
            <section className="scroll-fade-in">
              <h2 className="text-3xl font-bold text-pulsee-white mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Pulsee, we believe that staying informed shouldn't be overwhelming. Our mission is to deliver 
                personalized, AI-curated news that helps you understand the world around you without the noise.
              </p>
            </section>

            <section className="scroll-slide-left">
              <h2 className="text-3xl font-bold text-pulsee-white mb-6">What Makes Us Different</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card/20 backdrop-blur-sm border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-pulsee-green mb-4">AI-Powered Curation</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI algorithms analyze thousands of sources to bring you the most relevant and important news.
                  </p>
                </div>
                <div className="bg-card/20 backdrop-blur-sm border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-pulsee-green mb-4">Real-Time Updates</h3>
                  <p className="text-muted-foreground">
                    Stay ahead with live updates and breaking news delivered as they happen.
                  </p>
                </div>
              </div>
            </section>

            <section className="scroll-slide-right">
              <h2 className="text-3xl font-bold text-pulsee-white mb-6">Our Values</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-pulsee-green rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-pulsee-white mb-2">Accuracy First</h4>
                    <p className="text-muted-foreground">We prioritize factual, verified information from trusted sources.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-pulsee-green rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-pulsee-white mb-2">User Privacy</h4>
                    <p className="text-muted-foreground">Your data and reading preferences are protected and never sold.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-pulsee-green rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-lg font-semibold text-pulsee-white mb-2">Innovation</h4>
                    <p className="text-muted-foreground">Continuously improving to provide the best news experience.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
