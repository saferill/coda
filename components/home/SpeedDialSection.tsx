import { motion } from 'motion/react';
import Image from 'next/image';
import { Track } from '@/lib/store';
import { getHighResImage } from '@/lib/utils';
import { MarqueeText } from '@/components/MarqueeText';

interface Props {
  speedDialTracks: Track[];
  playTrack: (track: Track, queue: Track[], context: 'similar' | 'playlist') => void;
}

export function SpeedDialSection({ speedDialTracks, playTrack }: Props) {
  if (speedDialTracks.length === 0) return null;

  return (
    <div className="px-6">
      <h2 className="text-sm font-sans tracking-widest uppercase text-[#FAF9F6]/50 mb-6">Speed Dial</h2>
      <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory scroll-smooth pb-4">
        {speedDialTracks.slice(0, 10).map((track, i) => (
          <motion.div
            key={`speeddial-${track.videoId}-${i}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            className="w-[140px] shrink-0 snap-center group cursor-pointer"
            onClick={() => playTrack(track, speedDialTracks, 'similar')}
          >
            <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden mb-4 shadow-lg">
              <Image 
                src={getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 400)} 
                alt={track.name} 
                fill 
                sizes="140px" 
                className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
              />
            </div>
            <div className="flex flex-col">
              <MarqueeText text={track.name} className="text-[#FAF9F6] text-sm font-serif font-medium mb-1" />
              <span className="text-[9px] font-sans tracking-widest uppercase text-[#FAF9F6]/40 line-clamp-1">
                {Array.isArray(track.artist) ? track.artist.map((a: any) => a.name).join(', ') : track.artist?.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
