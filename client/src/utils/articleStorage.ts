// Utility for managing article data with short IDs

export const generateShortId = (): string => {
  // Generate random 8-10 digit ID
  const length = Math.floor(Math.random() * 3) + 8; // 8, 9, or 10 digits
  let id = '';
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10).toString();
  }
  return id;
};

export const storeArticle = (article: any): string => {
  const id = generateShortId();
  const storageKey = `article_${id}`;
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(article));
    // Set expiration (24 hours from now)
    localStorage.setItem(`${storageKey}_expires`, (Date.now() + 24 * 60 * 60 * 1000).toString());
    return id;
  } catch (error) {
    console.error('Error storing article:', error);
    throw new Error('Failed to store article');
  }
};

export const getArticle = (id: string): any | null => {
  const storageKey = `article_${id}`;
  const expiresKey = `${storageKey}_expires`;
  
  try {
    const expiresAt = localStorage.getItem(expiresKey);
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
      // Article has expired, remove it
      localStorage.removeItem(storageKey);
      localStorage.removeItem(expiresKey);
      return null;
    }
    
    const articleData = localStorage.getItem(storageKey);
    if (!articleData) {
      return null;
    }
    
    return JSON.parse(articleData);
  } catch (error) {
    console.error('Error retrieving article:', error);
    return null;
  }
};

export const cleanupExpiredArticles = (): void => {
  const now = Date.now();
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('article_') && key.endsWith('_expires')) {
      const expiresAt = localStorage.getItem(key);
      if (expiresAt && now > parseInt(expiresAt)) {
        const articleKey = key.replace('_expires', '');
        keysToRemove.push(articleKey);
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};