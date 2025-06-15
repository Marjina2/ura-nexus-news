
export interface NewsArticleData {
  id: string;
  original_title: string;
  rephrased_title: string | null;
  summary: string | null;
  image_url: string | null;
  source_url: string | null;
  created_at: string;
}
