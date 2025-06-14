
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookmarkIcon, TrendingUp, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import SimpleLoading from '@/components/ui/simple-loading';

const Dashboard = () => {
  const { bookmarks, loading, error, removeBookmark } = useBookmarks();
  const [removingId, setRemovingId] = useState<string | null>(null);
  useScrollAnimation();

  const handleRemoveBookmark = async (bookmarkId: string) => {
    setRemovingId(bookmarkId);
    try {
      await removeBookmark(bookmarkId);
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const bookmarked = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - bookmarked.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-pulsee-black">
      <Header />
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="scroll-scale-in text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-pulsee-white mb-4">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Manage your saved articles and track your reading activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="scroll-fade-in grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Saved Articles
                </CardTitle>
                <BookmarkIcon className="h-4 w-4 text-pulsee-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pulsee-white">
                  {loading ? '...' : bookmarks.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total bookmarked articles
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Week
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pulsee-white">
                  {loading ? '...' : bookmarks.filter(b => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(b.bookmarked_at) > weekAgo;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Articles saved this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Recent Activity
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pulsee-white">
                  {loading ? '...' : bookmarks.length > 0 ? formatTimeAgo(bookmarks[0].bookmarked_at) : 'None'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last article saved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bookmarked Articles */}
          <div className="scroll-slide-left">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pulsee-white flex items-center gap-2">
                  <BookmarkIcon className="w-5 h-5 text-pulsee-green" />
                  Your Saved Articles
                </CardTitle>
                <CardDescription>
                  Articles you've bookmarked for later reading
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <SimpleLoading text="Loading your bookmarks..." />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-400 mb-4">Failed to load bookmarks</p>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookmarkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-pulsee-white mb-2">No bookmarks yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start saving articles you want to read later
                    </p>
                    <Button asChild className="bg-pulsee-green hover:bg-pulsee-green/80">
                      <a href="/news">Browse News</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:border-pulsee-green/30 transition-colors group"
                      >
                        {bookmark.image_url && (
                          <img
                            src={bookmark.image_url}
                            alt={bookmark.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-pulsee-white font-medium mb-2 line-clamp-2 group-hover:text-pulsee-green transition-colors">
                            {bookmark.title}
                          </h3>
                          {bookmark.description && (
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {bookmark.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              {bookmark.source_name && (
                                <Badge variant="outline" className="text-xs">
                                  {bookmark.source_name}
                                </Badge>
                              )}
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(bookmark.bookmarked_at)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="text-xs"
                              >
                                <a href={bookmark.article_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Read
                                </a>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveBookmark(bookmark.id)}
                                disabled={removingId === bookmark.id}
                                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
