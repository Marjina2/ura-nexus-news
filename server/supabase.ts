import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if SUPABASE_URL is actually a PostgreSQL connection string and convert it
if (supabaseUrl && supabaseUrl.startsWith('postgresql://')) {
  // Extract the host from PostgreSQL URL and convert to Supabase REST API URL
  const match = supabaseUrl.match(/postgresql:\/\/postgres\.([^:]+):/);
  if (match) {
    const projectRef = match[1];
    supabaseUrl = `https://${projectRef}.supabase.co`;
    console.log('Converted PostgreSQL URL to Supabase REST API URL:', supabaseUrl);
  } else {
    console.error('Could not parse PostgreSQL URL to extract project reference');
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase news data
export interface SupabaseArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image_url: string;
  source: string;
  author: string;
  category: string;
  country: string;
  language: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// News fetching functions
export async function fetchNewsFromSupabase(
  category: string = 'general',
  country: string = 'us',
  limit: number = 20
): Promise<SupabaseArticle[]> {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (category && category !== 'general') {
      query = query.eq('category', category);
    }

    if (country && country !== 'us') {
      query = query.eq('country', country);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching news from Supabase:', error);
    return [];
  }
}

export async function fetchCachedArticlesFromSupabase(limit: number = 10): Promise<SupabaseArticle[]> {
  try {
    const { data, error } = await supabase
      .from('cached_articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase cached articles error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching cached articles from Supabase:', error);
    return [];
  }
}

export async function fetchSpotlightArticlesFromSupabase(limit: number = 5): Promise<SupabaseArticle[]> {
  try {
    const { data, error } = await supabase
      .from('spotlight_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase spotlight articles error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching spotlight articles from Supabase:', error);
    return [];
  }
}