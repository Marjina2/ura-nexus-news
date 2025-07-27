
export interface NewsArticleData {
  id: string;
  original_title: string;
  rephrased_title: string | null;
  summary: string | null;
  image_url: string | null;
  source_url: string | null;
  source_name: string;
  created_at: string;
  full_content: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
}
