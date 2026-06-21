'use client';

import { useState, useEffect } from 'react';
import { Track } from '@/lib/store';
import { db, RecentSearch } from '@/lib/db';
import { TrackItem } from '@/components/TrackItem';
import { ArtistItem } from '@/components/ArtistItem';
import { Search as SearchIcon, Loader2, ArrowLeft, X, ArrowUpLeft, History } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

import { SearchSkeleton } from '@/components/SearchSkeleton';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const tabs = ['Semua', 'Lagu', 'Video', 'Album', 'Artis', 'Daftar putar'];

  useEffect(() => {
    const loadRecentSearches = async () => {
      const searches = await db.getRecentSearches();
      setRecentSearches(searches);
    };
    loadRecentSearches();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim()) {
        try {
          const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setIsFocused(false);
    
    // Save to recent searches
    await db.addRecentSearch(searchQuery);
    const searches = await db.getRecentSearches();
    setRecentSearches(searches);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleRemoveRecentSearch = async (e: React.MouseEvent, queryToRemove: string) => {
    e.stopPropagation();
    await db.removeRecentSearch(queryToRemove);
    const searches = await db.getRecentSearches();
    setRecentSearches(searches);
  };

  return (
    <main className="min-h-screen pt-6 pb-24">
      <div className="px-6 mb-8 flex items-center gap-4 border-b border-[#FAF9F6]/10 pb-4">
        <button onClick={() => router.back()} className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <form onSubmit={onSubmit} className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search"
            autoFocus
            className="w-full bg-transparent text-[#FAF9F6] font-serif text-2xl placeholder:text-[#FAF9F6]/20 focus:outline-none transition-all"
          />
          {query && (
            <button 
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#FAF9F6]/30 hover:text-[#FAF9F6] transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1} />
            </button>
          )}
        </form>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-6 mb-8 px-6 snap-x snap-mandatory scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-2 text-[9px] font-sans tracking-widest uppercase transition-all snap-center border-b ${
              activeTab === tab 
                ? 'text-[#FAF9F6] border-[#FAF9F6]' 
                : 'text-[#FAF9F6]/40 border-transparent hover:text-[#FAF9F6]/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {query && isFocused && (
        <div className="mb-6">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => {
                setQuery(suggestion);
                handleSearch(suggestion);
              }}
            >
              <div className="flex items-center gap-4">
                <SearchIcon className="w-5 h-5 text-white/50" />
                <span className="text-white text-base">{suggestion}</span>
              </div>
              <ArrowUpLeft className="w-5 h-5 text-white/50" />
            </div>
          ))}
        </div>
      )}

      {!query && !loading && results.length === 0 && recentSearches.length > 0 && (
        <div className="mb-6">
          {recentSearches.map((search, index) => (
            <div 
              key={`recent-${index}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => {
                setQuery(search.query);
                handleSearch(search.query);
              }}
            >
              <div className="flex items-center gap-4">
                <History className="w-6 h-6 text-white/50" />
                <span className="text-white text-base">{search.query}</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => handleRemoveRecentSearch(e, search.query)}
                  className="text-white/50 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuery(search.query);
                    setIsFocused(true);
                  }}
                  className="text-white/50 hover:text-white p-1"
                >
                  <ArrowUpLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-6">
        {loading ? (
          <SearchSkeleton />
        ) : results.length > 0 ? (
          <div className="flex flex-col">
            {results.filter(item => {
              if (activeTab === 'Semua') return true;
              if (activeTab === 'Lagu') return item.type === 'SONG';
              if (activeTab === 'Video') return item.type === 'VIDEO';
              if (activeTab === 'Artis') return item.type === 'ARTIST';
              return false;
            }).map((item, index) => (
              item.type === 'ARTIST' 
                ? <ArtistItem key={`artist-${item.artistId}-${index}`} artist={item} />
                : <TrackItem key={`track-${item.videoId}-${index}`} track={item} queue={results.filter(r => r.type !== 'ARTIST')} />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center mt-32 text-[#FAF9F6]/30">
            <SearchIcon className="w-10 h-10 mb-6 opacity-20" strokeWidth={1} />
            <p className="font-serif text-lg">No results found</p>
          </div>
        ) : recentSearches.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-[#FAF9F6]/30">
            <SearchIcon className="w-10 h-10 mb-6 opacity-20" strokeWidth={1} />
            <p className="font-serif text-lg">Discover artists, songs, or albums</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
