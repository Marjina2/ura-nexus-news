
import React from 'react';
import { Code, Zap, Shield, BarChart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const API = () => {
  const apiFeatures = [
    {
      icon: <Code className="w-8 h-8 text-ura-green" />,
      title: 'RESTful API',
      description: 'Clean, intuitive REST endpoints for easy integration'
    },
    {
      icon: <Zap className="w-8 h-8 text-ura-green" />,
      title: 'Real-time Data',
      description: 'Get the latest news updates as they happen'
    },
    {
      icon: <Shield className="w-8 h-8 text-ura-green" />,
      title: 'Secure Authentication',
      description: 'API keys and OAuth 2.0 for secure access'
    },
    {
      icon: <BarChart className="w-8 h-8 text-ura-green" />,
      title: 'Usage Analytics',
      description: 'Detailed analytics and usage monitoring'
    }
  ];

  const endpoints = [
    { method: 'GET', path: '/api/news', description: 'Fetch latest news articles' },
    { method: 'GET', path: '/api/news/{id}', description: 'Get specific article details' },
    { method: 'GET', path: '/api/categories', description: 'List all news categories' },
    { method: 'GET', path: '/api/trending', description: 'Get trending topics and articles' }
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              API Access
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Integrate URA's AI-powered news data into your applications
            </p>
          </div>
        </section>

        {/* API Features */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">API Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {apiFeatures.map((feature, index) => (
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

        {/* API Endpoints */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">API Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded text-sm font-mono ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-ura-green font-mono">{endpoint.path}</code>
                      <span className="text-muted-foreground">{endpoint.description}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Quick Start Example</h2>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`curl -X GET "https://api.ura.com/v1/news" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

{
  "status": "success",
  "data": {
    "articles": [
      {
        "id": "123",
        "title": "AI Revolution in Healthcare",
        "summary": "Latest developments...",
        "category": "technology",
        "published_at": "2025-01-15T10:30:00Z"
      }
    ]
  }
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join developers who are building amazing applications with our API
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-3 text-lg">
                Get API Key
              </Button>
              <Button variant="outline" className="border-ura-green text-ura-green hover:bg-ura-green hover:text-ura-black px-8 py-3 text-lg">
                View Documentation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default API;
