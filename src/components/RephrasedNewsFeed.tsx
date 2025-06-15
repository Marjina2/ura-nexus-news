
import React from "react";
import { useRephrasedNews } from "@/hooks/useRephrasedNews";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const RephrasedNewsFeed: React.FC = () => {
  const { articles, isLoading, error, hasMore, loadMore, isFetching } = useRephrasedNews();

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <Sparkles className="animate-spin mx-auto mb-2" />
        Loading curated AI-rephrased news...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Failed to load AI-rephrased news. <Button variant="outline" onClick={loadMore}>Retry</Button>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No AI-rephrased news articles found yet.
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ura-green mb-2 flex items-center gap-2">
          <Sparkles /> AI-Rephrased Fresh News
        </h2>
        <div className="max-w-2xl text-muted-foreground mb-4">
          Handpicked latest news from trusted sources, AI-reworded by Gemini for clarity & neutrality, fully automated every 15 minutes.
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-card/60 border rounded-lg overflow-hidden hover:shadow-lg">
            <img
              src={article.image_url || "/placeholder.svg"}
              alt={article.rephrased_title || article.original_title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div className="p-5 flex flex-col h-full">
              <div className="mb-2 text-xs text-muted-foreground">{new Date(article.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
              <h3 className="text-lg font-bold mb-2 text-pulsee-white">{article.rephrased_title || article.original_title}</h3>
              <p className="text-sm mb-4 text-muted-foreground line-clamp-3">{article.summary}</p>
              <a
                href={article.source_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1 text-ura-green font-semibold hover:underline"
              >
                Read Source
              </a>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-6">
          <Button onClick={loadMore} disabled={isFetching}>
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RephrasedNewsFeed;
