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
    <div className="px-4">
      <h2 className="text-2xl font-bold text-white mb-4">Speed dial</h2>
      <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth pb-4">
        {Array.from({ length: Math.ceil(speedDialTracks.length / 9) }).map((_, i) => {
          const chunk = speedDialTracks.slice(i * 9, i * 9 + 9);
          return (
            <motion.div
              key={`speeddial-chunk-${i}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-[85vw] sm:w-[400px] shrink-0 snap-center grid grid-cols-3 gap-2"
            >
              {chunk.map((track, j) => (
                <div
                  key={`speeddial-${track.videoId}-${j}`}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                  onClick={() => playTrack(track, speedDialTracks, 'similar')}
                >
                  <Image 
                    src={getHighResImage(track.thumbnails?.[track.thumbnails.length - 1]?.url, 200)} 
                    alt={track.name} 
                    fill 
                    sizes="64px" 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <MarqueeText text={track.name} className="text-white text-xs font-medium drop-shadow-md" />
                  </div>
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
