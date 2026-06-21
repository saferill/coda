import { useState, useEffect } from 'react';
import { Play, Plus, Radio, Check, PlusSquare } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePlayerStore, Track } from '@/lib/store';
import { db } from '@/lib/db';
import { MarqueeText } from './MarqueeText';

interface PlaylistData {
  playlistId: string;
  name: string;
  thumbnails: { url: string; width: number; height: number }[];
  videos: Track[];
}

export function CommunityPlaylistCard({ playlistId }: { playlistId: string }) {
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const playTrack = usePlayerStore((state) => state.playTrack);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`/api/ytplaylist?id=${playlistId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch`);
        
        const data = await res.json();
        setPlaylist({
          ...data,
          videos: data.videos || data.songs || []
        });
      } catch (error) {
        console.error('Failed to fetch playlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  if (loading) {
    return (
      <div className="w-[320px] bg-transparent border border-[#FAF9F6]/10 rounded-sm p-6 shrink-0 snap-center flex flex-col animate-pulse">
        <div className="flex gap-5 mb-8">
          <div className="w-20 h-20 bg-[#FAF9F6]/5 shrink-0 rounded-sm" />
          <div className="flex flex-col justify-center flex-1">
            <div className="h-4 w-3/4 bg-[#FAF9F6]/5 mb-3" />
            <div className="h-3 w-1/2 bg-[#FAF9F6]/5" />
          </div>
        </div>

        <div className="flex-1 space-y-5 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FAF9F6]/5 shrink-0 rounded-sm" />
              <div className="flex flex-col flex-1 gap-2">
                <div className="h-3 w-full bg-[#FAF9F6]/5" />
                <div className="h-2 w-2/3 bg-[#FAF9F6]/5" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#FAF9F6]/5">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6]/5" />
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6]/5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FAF9F6]/5" />
        </div>
      </div>
    );
  }

  if (!playlist) {
    return null;
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.videos && playlist.videos.length > 0) {
      playTrack(playlist.videos[0], playlist.videos, 'playlist');
    }
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!added) {
      await db.addPlaylist({
        id: playlist.playlistId,
        name: playlist.name,
        img: playlist.thumbnails?.[playlist.thumbnails.length - 1]?.url || '',
        tracks: playlist.videos || []
      });
      setAdded(true);
    }
  };

  const handleRadio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Start radio based on the first track
    if (playlist.videos && playlist.videos.length > 0) {
      playTrack(playlist.videos[0], [], 'similar');
    }
  };

  const handleClick = () => {
    router.push(`/playlist/${playlist.playlistId}`);
  };

  const displayTracks = playlist.videos?.slice(0, 3) || [];

  return (
    <div 
      onClick={handleClick}
      className="w-[320px] bg-transparent border border-[#FAF9F6]/10 hover:border-[#FAF9F6]/30 p-6 shrink-0 snap-center cursor-pointer transition-colors duration-500 flex flex-col relative group"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-[#FAF9F6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex gap-5 mb-8 relative z-10">
        <div className="w-20 h-20 overflow-hidden relative shrink-0 shadow-xl bg-[#121110]">
          {playlist.videos && playlist.videos.length >= 4 ? (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
              {playlist.videos.slice(0, 4).map((track, i) => (
                <div key={i} className="relative w-full h-full">
                  <Image 
                    src={track.thumbnails?.[track.thumbnails.length - 1]?.url || '/placeholder.png'} 
                    alt={track.name} 
                    fill 
                    sizes="40px" 
                    className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
              ))}
            </div>
          ) : (
            <Image 
              src={playlist.thumbnails?.[playlist.thumbnails.length - 1]?.url || '/placeholder.png'} 
              alt={playlist.name} 
              fill 
              sizes="80px" 
              className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" 
            />
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <MarqueeText text={playlist.name} className="text-[#FAF9F6] font-serif font-bold text-xl leading-tight mb-2" />
          <p className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase">{playlist.videos?.length || 0} TRACKS</p>
        </div>
      </div>

      <div className="flex-1 space-y-5 mb-8 relative z-10">
        {displayTracks.map((track, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 overflow-hidden relative shrink-0">
              <Image 
                src={track.thumbnails?.[track.thumbnails.length - 1]?.url || '/placeholder.png'} 
                alt={track.name} 
                fill 
                sizes="40px" 
                className="object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-500" 
              />
            </div>
            <div className="flex flex-col overflow-hidden min-w-0 flex-1">
              <MarqueeText text={track.name} className="text-[#FAF9F6] text-sm font-serif mb-0.5" />
              <MarqueeText 
                text={Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name || 'Unknown Artist'} 
                className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase" 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[#FAF9F6]/10 relative z-10">
        <button 
          onClick={handlePlay}
          className="w-10 h-10 border border-[#FAF9F6] rounded-full flex items-center justify-center hover:bg-[#FAF9F6] hover:text-[#121110] text-[#FAF9F6] transition-all duration-300"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" strokeWidth={1} />
        </button>
        <button 
          onClick={handleRadio}
          className="w-10 h-10 border border-[#FAF9F6]/20 rounded-full flex items-center justify-center hover:border-[#FAF9F6]/60 text-[#FAF9F6]/60 hover:text-[#FAF9F6] transition-all duration-300"
        >
          <Radio className="w-4 h-4" strokeWidth={1} />
        </button>
        <button 
          onClick={handleAdd}
          className="w-10 h-10 border border-[#FAF9F6]/20 rounded-full flex items-center justify-center hover:border-[#FAF9F6]/60 text-[#FAF9F6]/60 hover:text-[#FAF9F6] transition-all duration-300 ml-auto"
        >
          {added ? <Check className="w-4 h-4" strokeWidth={1} /> : <Plus className="w-4 h-4" strokeWidth={1} />}
        </button>
      </div>
    </div>
  );
}
