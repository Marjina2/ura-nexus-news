
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RephrasedNewsArticle {
  id: string;
  original_title: string;
  rephrased_title: string | null;
  summary: string | null;
  image_url: string | null;
  source_url: string | null;
  created_at: string;
}

const PAGE_SIZE = 6;

export function useRephrasedNews() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["rephrased-news", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (error) throw error;
      return data as RephrasedNewsArticle[];
    },
    keepPreviousData: true,
  });

  // If fewer than PAGE_SIZE received, no more data.
  const hasMore = (data?.length ?? 0) === PAGE_SIZE;

  const loadMore = () => setPage((p) => p + 1);

  return {
    articles: data ?? [],
    isLoading,
    isFetching,
    error,
    refetch,
    page,
    hasMore,
    loadMore,
  };
}
