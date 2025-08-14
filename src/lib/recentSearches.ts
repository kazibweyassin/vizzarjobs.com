export interface RecentSearch {
  query: string;
  location?: string;
  timestamp: number;
}

const RECENT_SEARCHES_KEY = 'vizzar_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function saveRecentSearch(query: string, location?: string): void {
  // Don't save empty searches
  if (!query.trim()) return;

  const searches = getRecentSearches();
  
  // Check if this search already exists
  const existingIndex = searches.findIndex(
    (s) => s.query.toLowerCase() === query.toLowerCase() && 
           s.location?.toLowerCase() === location?.toLowerCase()
  );

  // If it exists, remove it so we can add it again at the top
  if (existingIndex !== -1) {
    searches.splice(existingIndex, 1);
  }

  // Add the new search at the beginning
  searches.unshift({
    query,
    location,
    timestamp: Date.now()
  });

  // Limit the number of recent searches
  const limitedSearches = searches.slice(0, MAX_RECENT_SEARCHES);

  // Save back to localStorage
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limitedSearches));
}

export function getRecentSearches(): RecentSearch[] {
  try {
    const searchesJson = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!searchesJson) return [];
    
    return JSON.parse(searchesJson);
  } catch (error) {
    console.error('Error retrieving recent searches:', error);
    return [];
  }
}

export function clearRecentSearches(): void {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function removeRecentSearch(index: number): void {
  const searches = getRecentSearches();
  if (index >= 0 && index < searches.length) {
    searches.splice(index, 1);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  }
}
