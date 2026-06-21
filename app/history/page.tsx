'use client';

import { ArrowLeft, Search, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/lib/store';
import Image from 'next/image';
import { getHighResImage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MarqueeText } from '@/components/MarqueeText';

export default function HistoryPage() {
  const router = useRouter();
  const history = usePlayerStore((state) => state.history);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Group history by Today, This Week, etc.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const todayHistory = history.filter(item => new Date(item.playedAt) >= today);
  const thisWeekHistory = history.filter(item => {
    const date = new Date(item.playedAt);
    return date >= startOfWeek && date < today;
  });
  const olderHistory = history.filter(item => new Date(item.playedAt) < startOfWeek);

  const renderTrackItem = (item: any) => {
    const track = item.track;
    const artistName = Array.isArray(track.artist) ? track.artist.map((a: any) => a.name).join(', ') : track.artist?.name || 'Unknown Artist';
    const thumbnail = getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 100);

    const formatDuration = (seconds?: number) => {
      if (!seconds) return '';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return ` • ${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
      <div 
        key={item.playedAt + track.videoId} 
        className="flex items-center gap-4 py-3 cursor-pointer hover:bg-[#FAF9F6]/5 px-6 rounded-sm transition-colors duration-300 border-b border-[#FAF9F6]/5 last:border-0 group"
        onClick={() => playTrack(track, history.map(h => h.track))}
      >
        <div className="relative w-12 h-12 overflow-hidden shrink-0 shadow-lg">
          <Image src={thumbnail} alt={track.name} fill sizes="56px" className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
        </div>
        <div className="flex-1 min-w-0 pb-1">
          <MarqueeText text={track.name} className="font-serif text-[15px] mb-0.5 text-[#FAF9F6]" />
          <MarqueeText 
            text={`${artistName}${formatDuration(track.duration)}`} 
            className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40" 
          />
        </div>
        <button className="p-2 text-[#FAF9F6]/30 hover:text-[#FAF9F6] transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4" strokeWidth={1} />
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen pb-24">
      <div className="sticky top-0 z-20 bg-[#121110]/80 backdrop-blur-xl border-b border-[#FAF9F6]/5 pt-6 pb-4 px-6 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <span className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]">History</span>
        </div>
        <button className="text-[#FAF9F6] hover:text-[#FAF9F6]/70 transition-colors">
          <Search className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-6 mt-6 mb-8">
        <button className="pb-1 text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6] border-b border-[#FAF9F6] transition-all">
          Local
        </button>
      </div>

      <div className="space-y-8">
      <div className="space-y-12 mt-4">
        {todayHistory.length > 0 && (
          <div>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50 px-6 mb-6">Today</h2>
            <div className="flex flex-col">
              {todayHistory.map(renderTrackItem)}
            </div>
          </div>
        )}

        {thisWeekHistory.length > 0 && (
          <div>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50 px-6 mb-6">This Week</h2>
            <div className="flex flex-col">
              {thisWeekHistory.map(renderTrackItem)}
            </div>
          </div>
        )}

        {olderHistory.length > 0 && (
          <div>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#FAF9F6]/50 px-6 mb-6">Older</h2>
            <div className="flex flex-col">
              {olderHistory.map(renderTrackItem)}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="text-center text-[#FAF9F6]/40 font-serif italic mt-32">
            No history yet
          </div>
        )}
      </div>
    </main>
  );
}
