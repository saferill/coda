'use client';

import { ArrowLeft, Search, Play, Shuffle, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/lib/store';
import Image from 'next/image';
import { getHighResImage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MarqueeText } from '@/components/MarqueeText';

export default function Top50Page() {
  const router = useRouter();
  const history = usePlayerStore((state) => state.history);
  const playCounts = usePlayerStore((state) => state.playCounts);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate top 50 tracks
  // We need to get the track details from history, so we'll map over history to get unique tracks
  const uniqueTracks = Array.from(new Map(history.map(item => [item.track.videoId, item.track])).values());
  
  const topTracks = uniqueTracks
    .map(track => ({
      track,
      count: playCounts[track.videoId] || 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50)
    .map(item => item.track);

  const totalDuration = topTracks.reduce((acc, track) => acc + (track.duration || 0), 0);
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const coverImage = topTracks.length > 0 
    ? getHighResImage(topTracks[0].thumbnails?.[topTracks[0].thumbnails.length - 1]?.url, 800)
    : 'https://picsum.photos/seed/top50/800/800';

  return (
    <main className="min-h-screen pb-24">
      <div className="sticky top-0 z-20 bg-[#121110]/80 backdrop-blur-xl border-b border-[#FAF9F6]/5 pt-6 pb-4 px-6 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <span className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]">My Top 50</span>
        </div>
        <button className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
          <Search className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col items-center px-6 mt-12 mb-16">
        <div className="relative w-64 h-64 border border-[#FAF9F6]/10 mb-8 overflow-hidden shadow-2xl group cursor-pointer" onClick={() => topTracks.length > 0 && playTrack(topTracks[0], topTracks)}>
          <Image src={coverImage} alt="My Top 50" fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
          <div className="absolute inset-0 bg-[#121110]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-[#FAF9F6] flex items-center justify-center text-[#FAF9F6] backdrop-blur-sm">
              <Play className="w-6 h-6 fill-current ml-1" strokeWidth={1} />
            </div>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#FAF9F6] mb-3 tracking-tight text-center">My Top 50</h2>
        <p className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/40 mb-8 text-center">
          {topTracks.length} TRACKS • {formatDuration(totalDuration)}
        </p>
        
        <div className="flex items-center gap-6">
          <button className="text-[#FAF9F6]/40 hover:text-[#FAF9F6] transition-colors">
            <Shuffle className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button 
            className="w-14 h-14 border border-[#FAF9F6] rounded-full flex items-center justify-center text-[#FAF9F6] hover:bg-[#FAF9F6] hover:text-[#121110] transition-all"
            onClick={() => topTracks.length > 0 && playTrack(topTracks[0], topTracks)}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" strokeWidth={1} />
          </button>
          <button className="text-[#FAF9F6]/40 hover:text-[#FAF9F6] transition-colors">
            <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="px-6 mb-6">
        <h3 className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/50 border-b border-[#FAF9F6]/10 pb-4">All time</h3>
      </div>

      <div className="space-y-1">
        {topTracks.map((track, index) => {
          const artistName = Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name || 'Unknown Artist';
          
          return (
            <div 
              key={track.videoId} 
              className="flex items-center gap-4 py-3 cursor-pointer hover:bg-[#FAF9F6]/5 px-6 transition-colors duration-300 border-b border-[#FAF9F6]/5 last:border-0 group"
              onClick={() => playTrack(track, topTracks)}
            >
              <div className="w-6 text-center text-[#FAF9F6]/30 text-[9px] font-sans tracking-widest pt-1 group-hover:text-[#FAF9F6] transition-colors">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0 pb-1 pl-2 border-l border-[#FAF9F6]/10 ml-2 group-hover:border-transparent transition-colors">
                <MarqueeText text={track.name} className="font-serif text-[15px] mb-0.5 text-[#FAF9F6]" />
                <MarqueeText 
                  text={`${artistName}${track.duration ? ` • ${Math.floor(track.duration / 60)}:${Math.floor(track.duration % 60).toString().padStart(2, '0')}` : ''}`} 
                  className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40" 
                />
              </div>
              <button className="p-2 text-[#FAF9F6]/30 hover:text-[#FAF9F6] transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" strokeWidth={1} />
              </button>
            </div>
          );
        })}

        {topTracks.length === 0 && (
          <div className="text-center text-[#FAF9F6]/40 font-serif italic mt-32">
            No top tracks yet
          </div>
        )}
      </div>
    </main>
  );
}
