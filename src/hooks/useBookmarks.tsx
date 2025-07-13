
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface Bookmark {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  source_name?: string;
  article_url: string;
  bookmarked_at: string;
}

export const useBookmarks = () => {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarks from Supabase
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('bookmarked_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (article: {
    url: string;
    title: string;
    description?: string;
    image_url?: string;
    source_name?: string;
  }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          article_url: article.url,
          title: article.title,
          description: article.description,
          image_url: article.image_url,
          source_name: article.source_name,
        });

      if (error) throw error;
      
      await fetchBookmarks(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      setError(error instanceof Error ? error.message : 'Failed to add bookmark');
      return false;
    }
  };

  const removeBookmark = async (articleUrl: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('article_url', articleUrl);

      if (error) throw error;
      
      await fetchBookmarks(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove bookmark');
      return false;
    }
  };

  const isBookmarked = (articleUrl: string) => {
    return bookmarks.some(b => b.article_url === articleUrl);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    loading,
    error,
    count: bookmarks.length,
    maxBookmarks: 'Unlimited',
  };
};
