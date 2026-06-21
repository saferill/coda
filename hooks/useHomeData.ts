import { useState, useEffect } from 'react';
import { Track, usePlayerStore } from '@/lib/store';

export function useHomeData() {
  const [heroTracks, setHeroTracks] = useState<Track[]>([]);
  const [speedDialTracks, setSpeedDialTracks] = useState<Track[]>([]);
  const [quickPicksTracks, setQuickPicksTracks] = useState<Track[]>([]);
  const [communityPlaylists, setCommunityPlaylists] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ key: string; title: string; type: 'song' | 'mixed'; items: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterData, setFilterData] = useState<{ title: string; tracks: Track[] }[]>([]);
  const [loadingFilter, setLoadingFilter] = useState(false);
  
  const history = usePlayerStore((state) => state.history);

  // Filter effect
  useEffect(() => {
    if (!activeFilter) return;
    const fetchFilterData = async () => {
      setLoadingFilter(true);
      try {
        const queries = [
          { title: `Feeling ${activeFilter.toLowerCase()}`, q: `${activeFilter} mood songs` },
          { title: `${activeFilter} hits`, q: `top ${activeFilter} songs` },
          { title: `More like ${activeFilter}`, q: `best ${activeFilter} tracks` },
        ];

        const results = [];
        for (const { title, q } of queries) {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=song`);
          const data = await res.json();
          results.push({ title, tracks: data.slice(0, 10) });
        }
        setFilterData(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFilter(false);
      }
    };
    fetchFilterData();
  }, [activeFilter]);

  const lastHistoryTrackId = history[0]?.track?.videoId;

  // Main Home Data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const queries: { key: string; title?: string; q: string; type?: string }[] = [
          { key: 'hero', q: 'dave how i met my ex', type: 'song' },
          { key: 'speedDial', q: 'top hits 2024', type: 'song' },
          { key: 'quickPicks', q: 'viral hits indonesia', type: 'song' },
          { key: 'community', q: 'chill playlists', type: 'playlist' },
          { key: 'artists', q: 'artis indonesia populer', type: 'artist' },
        ];

        const defaultCategories = [
          { key: 'cat0', title: 'Trending Now', q: 'lagu indonesia hits terbaru', type: 'song' },
          { key: 'cat1', title: 'New Releases', q: 'lagu pop indonesia rilis terbaru', type: 'song' },
          { key: 'similar0', title: 'Serupa dengan Ryuuuchiee', q: 'Ryuuuchiee', type: 'all' },
          { key: 'similar1', title: 'Serupa dengan Tems', q: 'Tems', type: 'all' },
          { key: 'similar2', title: 'Serupa dengan Hindia', q: 'Hindia', type: 'all' },
          { key: 'similar3', title: 'Serupa dengan Nadin Amizah', q: 'Nadin Amizah', type: 'all' },
          { key: 'similar4', title: 'Serupa dengan Pamungkas', q: 'Pamungkas', type: 'all' },
          { key: 'cat2', title: 'Top 50 Indonesia', q: 'top 50 indonesia playlist update', type: 'song' },
          { key: 'cat3', title: 'Viral on TikTok', q: 'lagu fyp tiktok viral', type: 'song' },
          { key: 'cat4', title: 'For Eid Getaways', q: 'lagu lebaran idul fitri', type: 'song' },
          { key: 'cat5', title: 'Surrender to the Beat', q: 'lagu edm jedag jedug', type: 'song' },
          { key: 'cat6', title: 'Fun throwbacks', q: 'lagu nostalgia 2000an indonesia', type: 'song' },
          { key: 'cat7', title: 'Feel-good rock', q: 'lagu rock indonesia terbaik', type: 'song' },
          { key: 'cat8', title: 'Acoustic Chill', q: 'lagu akustik cafe santai', type: 'song' },
        ];

        queries.push(...defaultCategories);

        const results = [];
        for (let i = 0; i < queries.length; i += 3) {
          const chunk = queries.slice(i, i + 3);
          const chunkResults = await Promise.all(
            chunk.map(async ({ key, title, q, type }) => {
              try {
                const url = type
                  ? `/api/search?q=${encodeURIComponent(q)}&type=${type}`
                  : `/api/search?q=${encodeURIComponent(q)}`;
                const res = await fetch(url);
                if (!res.ok) return { key, title, data: [] };
                const data = await res.json();
                return { key, title, data };
              } catch (e) {
                return { key, title, data: [] };
              }
            })
          );
          results.push(...chunkResults);
        }

        const cats: { key: string; title: string; type: 'song' | 'mixed'; items: any[] }[] = [];

        results.forEach(({ key, title, data }) => {
          if (!data || data.length === 0) return;
          if (key === 'hero') setHeroTracks(data.slice(0, 3));
          else if (key === 'speedDial') setSpeedDialTracks(data.slice(0, 45));
          else if (key === 'quickPicks') setQuickPicksTracks(data.slice(0, 20));
          else if (key === 'community') setCommunityPlaylists(data.slice(0, 10));
          else if (key === 'artists') setArtists(data.slice(0, 10));
          else if (key.startsWith('cat') && title) cats.push({ key, title, type: 'song', items: data.slice(0, 10) });
          else if (key.startsWith('similar') && title) cats.push({ key, title, type: 'mixed', items: data.slice(0, 10) });
        });

        const orderMap = new Map(defaultCategories.map((c, i) => [c.key, i]));
        cats.sort((a, b) => (orderMap.get(a.key) ?? 999) - (orderMap.get(b.key) ?? 999));

        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();

    const handleFocus = () => fetchHomeData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [lastHistoryTrackId]);

  return {
    heroTracks,
    speedDialTracks,
    quickPicksTracks,
    communityPlaylists,
    artists,
    categories,
    loading,
    activeFilter,
    setActiveFilter,
    filterData,
    loadingFilter,
  };
}
