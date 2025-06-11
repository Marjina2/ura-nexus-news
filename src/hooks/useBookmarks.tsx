
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export interface Bookmark {
  id: string;
  title: string;
  category: string;
  date: string;
  url: string;
  summary?: string;
}

export const useBookmarks = () => {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for now - in production this would sync with your backend
  useEffect(() => {
    if (user) {
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.id}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    }
  }, [user]);

  const addBookmark = async (article: Omit<Bookmark, 'id'>) => {
    if (!user) return false;

    const isPro = user.publicMetadata?.subscription === 'pro';
    const maxBookmarks = isPro ? Infinity : 20;

    if (bookmarks.length >= maxBookmarks) {
      throw new Error(`Free users can only save ${maxBookmarks} bookmarks. Upgrade to Pro for unlimited bookmarks.`);
    }

    const newBookmark: Bookmark = {
      ...article,
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
    
    return true;
  };

  const removeBookmark = async (bookmarkId: string) => {
    if (!user) return false;

    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
    
    return true;
  };

  const isBookmarked = (articleUrl: string) => {
    return bookmarks.some(b => b.url === articleUrl);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    loading,
    count: bookmarks.length,
    maxBookmarks: user?.publicMetadata?.subscription === 'pro' ? 'Unlimited' : 20,
  };
};
