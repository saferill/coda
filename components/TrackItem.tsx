'use client';

import { Track, usePlayerStore } from '@/lib/store';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getHighResImage } from '@/lib/utils';
import { MarqueeText } from './MarqueeText';

export function TrackItem({ track, queue, onRemove }: { track: Track; queue?: Track[]; onRemove?: (track: Track) => void }) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setTrackToAdd = usePlayerStore((state) => state.setTrackToAdd);
  const isCurrent = currentTrack?.videoId === track.videoId;

  const thumbnail = getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 200);
  const artistName = Array.isArray(track.artist) ? track.artist.map(a => a.name).join(', ') : track.artist?.name || 'Unknown Artist';

  return (
    <div
      className="flex items-center p-3 hover:bg-[#FAF9F6]/5 rounded-sm cursor-pointer group transition-colors duration-300 border-b border-[#FAF9F6]/5 last:border-0"
      onClick={() => playTrack(track, queue)}
    >
      <div className="relative w-12 h-12 overflow-hidden shrink-0 shadow-lg">
        <Image src={thumbnail} alt={track.name} fill sizes="48px" className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
        {isCurrent && isPlaying && (
          <div className="absolute inset-0 bg-[#121110]/40 flex items-center justify-center">
            <div className="flex gap-0.5 items-end h-3">
              <div className="w-1 bg-[#FAF9F6] animate-[bounce_1s_infinite_0ms]" />
              <div className="w-1 bg-[#FAF9F6] animate-[bounce_1s_infinite_200ms]" />
              <div className="w-1 bg-[#FAF9F6] animate-[bounce_1s_infinite_400ms]" />
            </div>
          </div>
        )}
      </div>
      <div className="ml-5 flex-1 min-w-0 pb-1">
        <MarqueeText text={track.name} className={`font-serif text-[15px] mb-0.5 ${isCurrent ? 'text-[#FAF9F6] font-bold italic' : 'text-[#FAF9F6]'}`} />
        <MarqueeText text={artistName} className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40" />
      </div>
      <div className="flex items-center gap-2">
        {onRemove && (
          <button 
            className="p-2 text-[#FAF9F6]/30 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(track);
            }}
          >
            <Trash2 className="w-4 h-4" strokeWidth={1} />
          </button>
        )}
        <button 
          className="p-2 text-[#FAF9F6]/30 hover:text-[#FAF9F6] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setTrackToAdd(track);
          }}
        >
          <MoreHorizontal className="w-4 h-4" strokeWidth={1} />
        </button>
      </div>
    </div>
  );
}
