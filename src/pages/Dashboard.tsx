
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('bookmarked_at', { ascending: false });
        setBookmarks(data || []);
      }
    };
    fetchBookmarks();
  }, [user]);

  return (
    <div className="min-h-screen bg-ura-black flex flex-col items-center justify-start pt-24 px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-ura-green">Dashboard</h1>
      <p className="text-lg text-ura-white mb-8">
        Welcome to your dashboard! Here are your bookmarks.
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded bg-ura-green text-ura-black font-semibold text-lg hover:bg-ura-green/80 transition mb-6"
      >
        Back to Home
      </Link>
      <div className="w-full max-w-3xl">
        {user ? (
          <div>
            <h2 className="text-xl font-bold text-ura-green mb-4">Your Bookmarks</h2>
            {bookmarks.length === 0 ? (
              <p className="text-muted-foreground text-center">No bookmarks found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((bm) => (
                  <Card key={bm.id} className="bg-card border-border overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-ura-white">{bm.title}</h3>
                      {bm.description && <p className="text-muted-foreground mb-2">{bm.description}</p>}
                      {bm.image_url && (
                        <img src={bm.image_url} alt={bm.title} className="w-full h-32 object-cover rounded" />
                      )}
                      <a
                        href={bm.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-ura-green underline"
                      >
                        Read Article
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-ura-white">Please log in to view your bookmarks.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
