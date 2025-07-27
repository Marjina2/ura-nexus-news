
import React from 'react';
import { BarChart, TrendingUp, Users, Eye } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const usageData = [
    { month: 'Jan', articles: 1200, users: 450 },
    { month: 'Feb', articles: 1800, users: 680 },
    { month: 'Mar', articles: 2200, users: 820 },
    { month: 'Apr', articles: 2800, users: 1050 },
    { month: 'May', articles: 3200, users: 1200 },
    { month: 'Jun', articles: 3800, users: 1450 }
  ];

  const stats = [
    { icon: <Eye className="w-8 h-8 text-ura-green" />, label: 'Total Views', value: '2.4M', change: '+12%' },
    { icon: <Users className="w-8 h-8 text-ura-green" />, label: 'Active Users', value: '45K', change: '+8%' },
    { icon: <BarChart className="w-8 h-8 text-ura-green" />, label: 'Articles Read', value: '890K', change: '+15%' },
    { icon: <TrendingUp className="w-8 h-8 text-ura-green" />, label: 'Engagement Rate', value: '68%', change: '+5%' }
  ];

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Usage Analytics
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Track your content performance and user engagement
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-ura-green">{stat.change}</p>
                      </div>
                      <div className="opacity-50">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Article Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Article Views Over Time</CardTitle>
                  <CardDescription>Monthly article consumption trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="articles" fill="#40e0d0" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Active user growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#40e0d0" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Analytics Features */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Analytics Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-2">Real-time Tracking</h3>
                <p className="text-muted-foreground">Monitor your content performance in real-time</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-2">Custom Reports</h3>
                <p className="text-muted-foreground">Generate custom reports for your specific needs</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-2">Audience Insights</h3>
                <p className="text-muted-foreground">Understand your audience demographics and behavior</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-ura-green mb-2">Export Data</h3>
                <p className="text-muted-foreground">Export your analytics data in various formats</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Start Tracking Your Success
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get insights into your content performance and audience engagement
            </p>
            <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover px-8 py-3 text-lg">
              View Analytics Dashboard
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
