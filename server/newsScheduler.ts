import { fetchNewsFromSupabase, supabase } from './supabase';

let newsUpdateInterval: NodeJS.Timeout | null = null;

export function startNewsScheduler() {
  console.log('Starting news scheduler - updates every 10 minutes');
  
  // Initial fetch
  updateNewsCache();
  
  // Schedule updates every 10 minutes
  newsUpdateInterval = setInterval(updateNewsCache, 10 * 60 * 1000);
}

export function stopNewsScheduler() {
  if (newsUpdateInterval) {
    clearInterval(newsUpdateInterval);
    newsUpdateInterval = null;
    console.log('News scheduler stopped');
  }
}

async function updateNewsCache() {
  try {
    console.log('Updating news cache from Supabase...');
    
    // Fetch latest articles for different categories
    const categories = ['general', 'technology', 'business', 'sports', 'health'];
    const countries = ['us', 'in'];
    
    let totalFetched = 0;
    
    for (const category of categories) {
      for (const country of countries) {
        try {
          const articles = await fetchNewsFromSupabase(category, country, 5);
          totalFetched += articles.length;
          
          console.log(`Fetched ${articles.length} ${category} articles for ${country}`);
          
          // Add a small delay between requests to avoid overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error fetching ${category} articles for ${country}:`, error);
        }
      }
    }
    
    console.log(`News cache update completed. Total articles processed: ${totalFetched}`);
    
    // Clean up old articles (optional - remove articles older than 7 days)
    await cleanupOldArticles();
    
  } catch (error) {
    console.error('Error updating news cache:', error);
  }
}

async function cleanupOldArticles() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .lt('published_at', sevenDaysAgo.toISOString());
    
    if (error) {
      console.error('Error cleaning up old articles:', error);
    } else {
      console.log('Cleaned up articles older than 7 days');
    }
  } catch (error) {
    console.error('Error in cleanup process:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down news scheduler...');
  stopNewsScheduler();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down news scheduler...');
  stopNewsScheduler();
  process.exit(0);
});