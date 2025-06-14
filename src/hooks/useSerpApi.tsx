
import { useState } from 'react';

interface SerpNewsResult {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  thumbnail?: string;
}

interface SerpImageResult {
  original: string;
  title: string;
  link: string;
}

export const useSerpApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNews = async (query: string, apiKey: string): Promise<SerpNewsResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&tbm=nws&api_key=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news from SERP API');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.news_results?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        date: item.date,
        source: item.source,
        thumbnail: item.thumbnail
      })) || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchImages = async (query: string, apiKey: string): Promise<SerpImageResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&tbm=isch&api_key=${apiKey}&num=1`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images from SERP API');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.images_results?.map((item: any) => ({
        original: item.original,
        title: item.title,
        link: item.link
      })) || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSpotlightNews = async (query: string, apiKey: string) => {
    try {
      const [newsResults, imageResults] = await Promise.all([
        searchNews(`${query} breaking news`, apiKey),
        searchImages(query, apiKey)
      ]);

      return {
        news: newsResults.slice(0, 5), // Get top 5 news results
        image: imageResults[0]?.original || null // Get first image
      };
    } catch (err) {
      console.error('Error fetching spotlight news:', err);
      throw err;
    }
  };

  return {
    searchNews,
    searchImages,
    getSpotlightNews,
    isLoading,
    error
  };
};
