// utils/recentSearches.ts
const STORAGE_KEY = "recent_searches";
const MAX_RECENT = 5; // or 10, up to you

export const getRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addRecentSearch = (keyword: string) => {
  if (!keyword.trim()) return;

  let searches = getRecentSearches();

  // Remove duplicates
  searches = searches.filter((item) => item.toLowerCase() !== keyword.toLowerCase());

  // Add new keyword at the front
  searches.unshift(keyword);

  // Limit history
  if (searches.length > MAX_RECENT) {
    searches = searches.slice(0, MAX_RECENT);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
};

export const deleteRecentSearch = (keyword: string) => {
    let searches = getRecentSearches();
    searches = searches.filter((item) => item.toLowerCase() !== keyword.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  };
  
export const clearRecentSearches = () => {
localStorage.removeItem(STORAGE_KEY);
};
