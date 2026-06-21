import { motion } from 'motion/react';
import Image from 'next/image';
import { Play, MoreVertical } from 'lucide-react';
import { Track } from '@/lib/store';
import { getHighResImage } from '@/lib/utils';
import { MarqueeText } from '@/components/MarqueeText';

interface Props {
  quickPicksTracks: Track[];
  playTrack: (track: Track, queue: Track[], context: 'similar' | 'playlist') => void;
}

export function QuickPicksSection({ quickPicksTracks, playTrack }: Props) {
  if (quickPicksTracks.length === 0) return null;

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-8 border-b border-[#FAF9F6]/10 pb-4">
        <h2 className="text-2xl font-serif font-bold text-[#FAF9F6]">Quick Picks</h2>
        <button
          className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/60 hover:text-[#FAF9F6] border border-[#FAF9F6]/20 rounded-full px-5 py-2 transition-all duration-300 hover:border-[#FAF9F6]/60"
          onClick={() => playTrack(quickPicksTracks[0], quickPicksTracks, 'similar')}
        >
          Play All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
        {quickPicksTracks.slice(0, 8).map((track, j) => (
          <div
            key={`quickpicks-${track.videoId}-${j}`}
            className="flex items-center justify-between cursor-pointer group hover:bg-[#FAF9F6]/5 py-3 px-3 -mx-3 transition-colors duration-300 border-b border-[#FAF9F6]/5 last:border-0"
            onClick={() => playTrack(track, quickPicksTracks, 'similar')}
          >
            <div className="flex items-center gap-5 min-w-0">
              <div className="relative w-10 h-10 overflow-hidden shrink-0">
                <Image 
                  src={getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 100)} 
                  alt={track.name} 
                  fill 
                  sizes="40px" 
                  className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" 
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <MarqueeText text={track.name} className="text-[#FAF9F6] font-serif text-[15px] mb-0.5" />
                <MarqueeText
                  text={Array.isArray(track.artist) ? track.artist.map((a: any) => a.name).join(', ') : track.artist?.name}
                  className="text-[#FAF9F6]/40 text-[9px] font-sans tracking-widest uppercase"
                />
              </div>
            </div>
            <button className="p-2 text-[#FAF9F6]/20 group-hover:text-[#FAF9F6] transition-colors ml-4 shrink-0">
              <MoreVertical className="w-4 h-4" strokeWidth={1} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
