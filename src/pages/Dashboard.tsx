
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookmarkIcon, Clock, TrendingUp, Settings } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Dashboard = () => {
  const { user } = useAuth();
  const { bookmarks, removeBookmark } = useBookmarks();
  const navigate = useNavigate();
  useScrollAnimation();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-scale-in mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-pulsee-white mb-2">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Manage your bookmarks, preferences, and stay updated with your personalized news feed.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="scroll-fade-in lg:col-span-3 grid md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-card/20 backdrop-blur-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                  <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pulsee-white">{bookmarks.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Saved articles
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/20 backdrop-blur-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pulsee-white">45m</div>
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/20 backdrop-blur-sm border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pulsee-white">12</div>
                  <p className="text-xs text-muted-foreground">
                    Following
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bookmarks Section */}
            <div className="scroll-slide-left lg:col-span-2">
              <Card className="bg-card/20 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-pulsee-white">Your Bookmarks</CardTitle>
                  <CardDescription>
                    Articles you've saved for later reading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-8">
                      <BookmarkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No bookmarks yet</p>
                      <Button 
                        onClick={() => navigate('/news')}
                        className="bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
                      >
                        Explore News
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookmarks.slice(0, 5).map((bookmark, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card/30 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-medium text-pulsee-white mb-1 line-clamp-1">
                              {bookmark.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {bookmark.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {bookmark.source}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(bookmark.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const articleData = encodeURIComponent(JSON.stringify(bookmark));
                                navigate(`/article?data=${articleData}`);
                              }}
                            >
                              Read
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeBookmark(bookmark.url)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      {bookmarks.length > 5 && (
                        <p className="text-center text-muted-foreground">
                          And {bookmarks.length - 5} more bookmarks...
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="scroll-slide-right">
              <Card className="bg-card/20 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-pulsee-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full bg-pulsee-green text-pulsee-black hover:bg-pulsee-green-hover"
                    onClick={() => navigate('/news')}
                  >
                    Browse Latest News
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-border hover:bg-card/30"
                    onClick={() => navigate('/account')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-border hover:bg-card/30"
                    onClick={() => navigate('/ai-picks')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    AI Recommendations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
