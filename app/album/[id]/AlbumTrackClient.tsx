'use client';

import { MoreVertical } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { MarqueeText } from '@/components/MarqueeText';

export default function AlbumTrackClient({ track, index, album, artistName }: { track: any, index: number, album: any, artistName: string }) {
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <div 
      className="flex items-center gap-4 py-3 cursor-pointer hover:bg-[#FAF9F6]/5 px-4 rounded-sm transition-colors duration-300 border-b border-[#FAF9F6]/5 last:border-0 group relative"
      onClick={() => playTrack(track, album.songs)}
    >
      <div className="w-8 text-[9px] font-sans tracking-widest text-[#FAF9F6]/30 hidden sm:block shrink-0 pt-1 group-hover:text-[#FAF9F6] transition-colors">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0 pb-1">
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
}
